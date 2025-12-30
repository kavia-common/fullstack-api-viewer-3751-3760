/* eslint-disable no-console */
const { spawn } = require("child_process");
const path = require("path");

function run(cmd, args, opts = {}) {
  const child = spawn(cmd, args, { stdio: "inherit", shell: false, ...opts });
  child.on("exit", (code) => process.exit(code ?? 0));
  return child;
}

/**
 * Start Vite dev server, wait for it, then start Electron pointing to it.
 */
async function main() {
  const cwd = path.join(__dirname, "..");

  // Start Vite
  const vite = run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "dev", "--", "--host", "0.0.0.0"], {
    cwd,
    env: { ...process.env }
  });

  // Wait for Vite to be reachable
  const waitOnBin = path.join(cwd, "node_modules", ".bin", process.platform === "win32" ? "wait-on.cmd" : "wait-on");
  const waitOn = run(waitOnBin, ["http://localhost:5173"], { cwd, env: { ...process.env } });

  waitOn.on("exit", (code) => {
    if (code !== 0) {
      console.error("wait-on failed; exiting");
      process.exit(code ?? 1);
    }

    const electronBin = path.join(cwd, "node_modules", ".bin", process.platform === "win32" ? "electron.cmd" : "electron");
    // Pass the dev server URL to main process
    run(electronBin, ["."], {
      cwd,
      env: { ...process.env, VITE_DEV_SERVER_URL: "http://localhost:5173" }
    });
  });

  // If Vite exits early, exit too.
  vite.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
