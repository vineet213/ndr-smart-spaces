/**
 * CMS foundation — authentication and role-based authorization (§15, Phase 4.1).
 *
 * Provides the RBAC model, session management, and server-side permission
 * enforcement for the CMS admin. The admin server derives identity from the
 * session cookie — never from client-supplied user/role fields.
 *
 * DEV AUTHENTICATION: This module includes a development-mode authentication
 * mechanism that issues sessions for fixed dev credentials. It is explicitly
 * marked as development-only and must be replaced with a production identity
 * provider (OIDC, SAML, etc.) before any non-localhost deployment.
 *
 * PRODUCTION SEAM: The SessionStore and authenticate() function are designed
 * as swappable seams. A production integration replaces these with a real
 * identity provider while keeping the authorization layer intact.
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// ─── Roles ────────────────────────────────────────────────────────────────────

/**
 * The four CMS roles, ordered by privilege level (ascending).
 * The existing codebase uses "super-admin" (editor.ts:238) — that maps here.
 * The existing dropdown roles (content-editor, investor-editor, etc.) are
 * specialised editors that share the "editor" permission tier.
 */
export const CMS_ROLES = ["viewer", "editor", "publisher", "super-admin"] as const;
export type CmsRole = (typeof CMS_ROLES)[number];

const ROLE_HIERARCHY: Record<CmsRole, number> = {
  viewer: 0,
  editor: 1,
  publisher: 2,
  "super-admin": 3,
};

export function hasRole(userRole: CmsRole, required: CmsRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required];
}

// ─── Permissions ──────────────────────────────────────────────────────────────

export type Permission =
  | "collection:read"
  | "collection:create"
  | "collection:update"
  | "collection:delete"
  | "collection:transition"
  | "collection:archive"
  | "collection:restore"
  | "export:run"
  | "deploy:run"
  | "audit:read"
  | "settings:read";

const ROLE_PERMISSIONS: Record<CmsRole, readonly Permission[]> = {
  viewer: ["collection:read", "audit:read", "settings:read"],
  editor: [
    "collection:read",
    "collection:create",
    "collection:update",
    "audit:read",
    "settings:read",
  ],
  publisher: [
    "collection:read",
    "collection:create",
    "collection:update",
    "collection:transition",
    "export:run",
    "deploy:run",
    "audit:read",
    "settings:read",
  ],
  "super-admin": [
    "collection:read",
    "collection:create",
    "collection:update",
    "collection:delete",
    "collection:transition",
    "collection:archive",
    "collection:restore",
    "export:run",
    "deploy:run",
    "audit:read",
    "settings:read",
  ],
};

export function hasPermission(userRole: CmsRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

// ─── Session ──────────────────────────────────────────────────────────────────

export type Session = {
  sessionId: string;
  user: string;
  role: CmsRole;
  createdAt: string;
};

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * In-memory session store. Adequate for a single-user localhost CMS.
 * Production replacement: database-backed or JWT-based sessions.
 */
const sessions = new Map<string, Session>();

function generateSessionId(): string {
  return randomBytes(24).toString("hex");
}

export function createSession(user: string, role: CmsRole): Session {
  const sessionId = generateSessionId();
  const session: Session = {
    sessionId,
    user,
    role,
    createdAt: new Date().toISOString(),
  };
  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  const age = Date.now() - new Date(session.createdAt).getTime();
  if (age > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

export function destroySession(sessionId: string): void {
  sessions.delete(sessionId);
}

// ─── Signed Cookie ────────────────────────────────────────────────────────────

/**
 * HMAC signing key. In production this would come from an environment variable
 * or secret manager. For localhost dev, a random per-process key is fine.
 */
const SIGNING_KEY = randomBytes(32).toString("hex");

const COOKIE_NAME = "ndr-cms-session";
const COOKIE_MAX_AGE = SESSION_TTL_MS / 1000;

export function signSessionCookie(sessionId: string): string {
  const signature = createHmac("sha256", SIGNING_KEY).update(sessionId).digest("hex");
  return `${sessionId}.${signature}`;
}

export function verifySessionCookie(cookieValue: string): string | null {
  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const sessionId = cookieValue.slice(0, dotIndex);
  const receivedSig = cookieValue.slice(dotIndex + 1);
  const expectedSig = createHmac("sha256", SIGNING_KEY).update(sessionId).digest("hex");
  if (receivedSig.length !== expectedSig.length) return null;
  const a = Buffer.from(receivedSig, "hex");
  const b = Buffer.from(expectedSig, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return sessionId;
}

export { COOKIE_NAME, COOKIE_MAX_AGE };

// ─── Cookie Parsing ───────────────────────────────────────────────────────────

export function parseCookies(header: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;
  for (const pair of header.split(";")) {
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) continue;
    const key = pair.slice(0, eqIndex).trim();
    const value = pair.slice(eqIndex + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

export function extractSession(req: { headers: { cookie?: string } }): Session | null {
  const cookies = parseCookies(req.headers.cookie);
  const cookieValue = cookies[COOKIE_NAME];
  if (!cookieValue) return null;
  const sessionId = verifySessionCookie(cookieValue);
  if (!sessionId) return null;
  return getSession(sessionId);
}

// ─── Authorization Errors ─────────────────────────────────────────────────────

export class AuthenticationError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Assert the session has the required permission. Throws AuthorizationError.
 */
export function requirePermission(session: Session, permission: Permission): void {
  if (!hasPermission(session.role, permission)) {
    throw new AuthorizationError(
      `Role "${session.role}" lacks permission "${permission}".`,
    );
  }
}

// ─── Development Authentication ───────────────────────────────────────────────

/**
 * Dev-mode credential store. These are fixed, well-known credentials for local
 * development only. They are printed to the console on server startup.
 *
 * PRODUCTION REPLACEMENT: Remove this entire section and connect authenticate()
 * to a real identity provider (OIDC, LDAP, etc.).
 */
export type DevCredential = {
  user: string;
  password: string;
  role: CmsRole;
};

export const DEV_CREDENTIALS: readonly DevCredential[] = [
  { user: "admin", password: "admin", role: "super-admin" },
  { user: "editor", password: "editor", role: "editor" },
  { user: "viewer", password: "viewer", role: "viewer" },
  { user: "publisher", password: "publisher", role: "publisher" },
] as const;

/**
 * Authenticate a user against the dev credential store.
 * Returns a session on success, null on failure.
 *
 * PRODUCTION REPLACEMENT: This function is the seam where a real identity
 * provider integration replaces dev credentials. The rest of the auth
 * architecture (sessions, RBAC, permission checks) remains unchanged.
 */
export function authenticate(user: string, password: string): Session | null {
  const credential = DEV_CREDENTIALS.find(
    (c) => c.user === user && c.password === password,
  );
  if (!credential) return null;
  return createSession(credential.user, credential.role);
}
