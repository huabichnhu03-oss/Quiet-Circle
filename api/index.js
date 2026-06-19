// Vercel serverless entry — ESM default export with explicit (req, res) handler.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = require(path.join(__dirname, "_server", "index.cjs"));
const app = server.default || server;

export default (req, res) => app(req, res);
