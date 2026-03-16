import path from "node:path";
import fs from "node:fs";

import type { NextConfig } from "next";

const appRoot = fs.realpathSync(__dirname);
const cwd = fs.realpathSync(process.cwd());
if (cwd !== appRoot) {
  console.error(
    `ERROR: Start the app from the ugc/ folder (or run ./run.sh from repo root).\nExpected cwd: ${appRoot}\nActual cwd:   ${cwd}`,
  );
  throw new Error("Invalid working directory for Next.js app");
}

const expectedEnvPath = path.join(appRoot, ".env.local");
if (fs.existsSync(expectedEnvPath)) {
  console.log("Loaded env from ugc/.env.local");
} else {
  console.error(`ERROR: Missing env file. Expected: ${expectedEnvPath}`);
  throw new Error(`Missing env file. Expected: ${expectedEnvPath}`);
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
