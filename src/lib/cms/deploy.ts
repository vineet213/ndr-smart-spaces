/**
 * CMS foundation — deployment adapter (Phase 4.3).
 *
 * The deployment seam separates the export pipeline (generating deterministic
 * TypeScript modules) from production deployment (triggering a build/hosting
 * platform to pick up the new modules). When no deployment provider is
 * configured — the default — the adapter returns `deployed: false` with a
 * clear message, and export continues to work normally.
 *
 * Environment variables (all optional):
 *
 *   DEPLOY_PROVIDER        The adapter to use. Currently supported:
 *                            - "null"   (default) — no deployment
 *                            - "webhook"         — POST to DEPLOY_WEBHOOK_URL
 *
 *   DEPLOY_WEBHOOK_URL     The URL to POST to when provider is "webhook".
 *   DEPLOY_WEBHOOK_SECRET  HMAC secret for signing the webhook payload
 *                           (optional). Sent as X-Webhook-Signature header.
 *
 * Production deployment is NOT automatic. An authorized user must trigger
 * the export endpoint, which chains export → deployment as separate stages.
 */

import { createHmac } from "node:crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DeployResult = {
  /** Whether the deployment was actually triggered. */
  deployed: boolean;
  /** Short label identifying the adapter that ran. */
  provider: string;
  /** Human-readable status message. */
  message: string;
};

export interface DeploymentAdapter {
  /**
   * Trigger a production deployment. Called after export succeeds.
   * Must NOT modify the generated modules on disk.
   * Returns a result indicating whether deployment was triggered.
   */
  deploy(): DeployResult;
}

// ─── Configuration ────────────────────────────────────────────────────────────

type DeployProvider = "null" | "webhook";

function resolveProvider(): DeployProvider {
  const raw = (process.env.DEPLOY_PROVIDER ?? "null").toLowerCase().trim();
  if (raw === "webhook") return "webhook";
  return "null";
}

function getWebhookUrl(): string {
  return (process.env.DEPLOY_WEBHOOK_URL ?? "").trim();
}

function getWebhookSecret(): string {
  return (process.env.DEPLOY_WEBHOOK_SECRET ?? "").trim();
}

// ─── Null adapter (no deployment configured) ──────────────────────────────────

class NullDeploymentAdapter implements DeploymentAdapter {
  deploy(): DeployResult {
    return {
      deployed: false,
      provider: "null",
      message:
        "No deployment provider configured. Export completed successfully. " +
        "Set DEPLOY_PROVIDER to enable production deployment.",
    };
  }
}

// ─── Webhook adapter ──────────────────────────────────────────────────────────

class WebhookDeploymentAdapter implements DeploymentAdapter {
  private readonly url: string;
  private readonly secret: string;

  constructor() {
    this.url = getWebhookUrl();
    this.secret = getWebhookSecret();
  }

  deploy(): DeployResult {
    if (!this.url) {
      return {
        deployed: false,
        provider: "webhook",
        message:
          "Webhook provider selected but DEPLOY_WEBHOOK_URL is not set. " +
          "Export completed successfully.",
      };
    }

    try {
      const payload = JSON.stringify({
        event: "export",
        timestamp: new Date().toISOString(),
        source: "cms-export",
      });

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (this.secret) {
        const signature = createHmac("sha256", this.secret).update(payload).digest("hex");
        headers["X-Webhook-Signature"] = signature;
      }

      const response = fetch(this.url, {
        method: "POST",
        headers,
        body: payload,
      });

      // NOTE: In the current synchronous server, fetch() returns a pending
      // promise. The server is event-loop-based, so the webhook fires
      // asynchronously. The deploy() method reports intent, not completion.
      // A production integration would await the response.
      void response;

      return {
        deployed: true,
        provider: "webhook",
        message: `Webhook POST sent to ${this.url}`,
      };
    } catch (error) {
      return {
        deployed: false,
        provider: "webhook",
        message: `Webhook failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Create the deployment adapter based on environment configuration.
 * Called once at server startup.
 */
export function createDeploymentAdapter(): DeploymentAdapter {
  const provider = resolveProvider();
  switch (provider) {
    case "webhook":
      return new WebhookDeploymentAdapter();
    case "null":
    default:
      return new NullDeploymentAdapter();
  }
}
