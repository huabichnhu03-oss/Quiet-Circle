// Vercel serverless entry — must be .cjs because package.json has "type": "module".
const path = require("path");
const server = require(path.join(__dirname, "..", "dist", "index.cjs"));

module.exports = server.default || server;
