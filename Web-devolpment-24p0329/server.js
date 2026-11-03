// Minimal static file server built on Node.js core modules (no extra dependencies)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  const file = path.join(__dirname, urlPath === "/" ? "index.html" : path.normalize(urlPath));
  if (!file.startsWith(__dirname)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Todo App running at http://localhost:${PORT}`));
