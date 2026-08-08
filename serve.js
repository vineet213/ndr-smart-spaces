const http = require("http");
const fs = require("fs");
const path = require("path");
const OUT = "D:\\Projects\\NDR\\out";
const PORT = 8765;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (p.endsWith("/")) p += "index.html";
    const fp = path.join(OUT, p);
    if (!fp.startsWith(OUT)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(fp, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("nf");
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(fp).toLowerCase()] || "application/octet-stream",
      });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log("serving on " + PORT));
