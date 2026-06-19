// Vercel serverless function entry point.
//
// `npm run build` (Vercel's buildCommand) creates:
//   dist/index.cjs  — compiled Express server
//   dist/public/    — compiled React client
//
// The `includeFiles: "dist/**"` in vercel.json ensures both directories
// are available in the serverless function's runtime filesystem.
//
// A dynamic require path prevents ncc from re-bundling the pre-built
// server artifact — it is loaded at runtime instead.

const path = require("path");

let app;
let initPromise;

function loadServer() {
  if (!initPromise) {
    initPromise = (async () => {
      const server = require(path.join(__dirname, "..", "dist", "index.cjs"));
      if (server.ready) {
        await server.ready;
      }
      app = server.default || server;
    })();
  }
  return initPromise;
}

module.exports = async (req, res) => {
  await loadServer();
  return app(req, res);
};

module.exports.config = {
  maxDuration: 30,
};
