#!/usr/bin/env node
// Launches the Keystatic dev server and opens /studio once it is serving.
// Next has no --open flag, and the port is not knowable up front (Next picks
// the next free one when 3000 is taken), so the real URL is read from its
// startup banner. Setting KEYSTATIC here rather than as a shell prefix keeps
// the script working on Windows too.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const autoOpen = process.env.CMS_NO_OPEN !== "1";

const child = spawn(
  process.platform === "win32" ? "next.cmd" : "next",
  ["dev", "--turbopack", ...args],
  {
    env: { ...process.env, KEYSTATIC: "1", FORCE_COLOR: "1" },
    stdio: ["inherit", "pipe", "inherit"],
    shell: process.platform === "win32",
  },
);

function isWsl() {
  if (process.platform !== "linux") return false;
  try {
    return /microsoft/i.test(readFileSync("/proc/version", "utf8"));
  } catch {
    return false;
  }
}

function openBrowser(url) {
  // Under WSL, xdg-open usually cannot reach the Windows browser.
  const [command, commandArgs] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", url]]
        : isWsl()
          ? ["explorer.exe", [url]]
          : ["xdg-open", [url]];
  try {
    // explorer.exe exits non-zero even on success, so failures are ignored.
    spawn(command, commandArgs, { stdio: "ignore", detached: true }).unref();
  } catch {
    /* the URL is printed below regardless */
  }
}

let studioUrl = null;
let opened = false;

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);

  const local = text.match(/Local:\s+(https?:\/\/\S+)/);
  if (local) studioUrl = `${local[1].replace(/\/+$/, "")}/studio`;

  if (studioUrl && !opened && /Ready in/.test(text)) {
    opened = true;
    process.stdout.write(`\n   Studio:       ${studioUrl}\n\n`);
    if (autoOpen) openBrowser(studioUrl);
  }
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
