const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "attendance.json");

const server = http.createServer((req, res) => {

  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ PRE-FLIGHT (VERY IMPORTANT)
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // ✅ POST /attendance
  if (req.method === "POST" && req.url === "/attendance") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {

      // ✅ BODY VALIDATION (KEY FIX)
      if (!body || body.trim() === "") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Empty request body ❌" }));
        return;
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (err) {
        console.error("JSON parse error:", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON ❌" }));
        return;
      }

      const entry = {
        user: data.user || "Unknown",
        time: data.time || new Date().toLocaleString()
      };

      let existing = [];
      try {
        existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch {
        existing = [];
      }

      existing.push(entry);

      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

      console.log("Saved:", entry);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        message: "Attendance saved & stored ✅"
      }));
    });

    return; // ⛔ VERY IMPORTANT
  }

  // ✅ GET /
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Adfin8 Backend is running OK");
    return;
  }
// GET /attendance  -> return attendance list
if (req.method === "GET" && req.url === "/attendance") {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Failed to read attendance ❌" }));
  }
  return;
}
  // ❌ ALL OTHERS
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
