/**
 * `npm run dev`: the Next.js dev server plus the local stand-ins for the PHP
 * endpoints (contact.php and chat.php, see contact-mock.mjs), so the enquiry
 * forms and the chatbot work without a second terminal.
 *
 * The chatbot answers from out/api/chat-knowledge.md, which `npm run build`
 * writes; it is refreshed here from the last build if there is one.
 * Extra arguments go to `next dev`, e.g. `npm run dev -- -p 3005`.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const ROOT = process.cwd();
const children = [];

function run(label, args) {
  const child = spawn(process.execPath, args, { cwd: ROOT, stdio: "inherit" });
  child.on("exit", (code) => {
    if (label === "next") process.exit(code ?? 0);
    if (code)
      console.warn(`dev: ${label} stopped (exit ${code}); the forms and chat may not work.`);
  });
  children.push(child);
}

if (existsSync(join(ROOT, "out"))) {
  run("chat knowledge", ["scripts/build-chat-knowledge.mjs"]);
} else {
  console.warn(
    "dev: no out/ folder yet; run `npm run build` once so the chatbot has the site to answer from.",
  );
}
run("contact/chat stand-in", ["scripts/contact-mock.mjs"]);
const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
run("next", [nextBin, "dev", ...process.argv.slice(2)]);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    for (const child of children) child.kill();
    process.exit(0);
  });
}
