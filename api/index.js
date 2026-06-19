// Vercel serverless entry — export the Express app directly (do not wrap in async).
const path = require("path");
const server = require(path.join(__dirname, "..", "dist", "index.cjs"));

module.exports = server.default || server;
