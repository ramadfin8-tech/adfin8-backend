const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "attendance.json");
const employeeFile = path.join(__dirname, "employees.json");

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

   // ✅ POST /attendance -> mark attendance per employee
if (req.method === "POST" && req.url === "/attendance") {
  let body = "";

  req.on("data", chunk => body += chunk.toString());

  req.on("end", () => {
    if (!body) {
      res.writeHead(400);
      res.end("Empty body");
      return;
    }

    const data = JSON.parse(body);

    const employees = JSON.parse(fs.readFileSync(employeeFile, "utf8"));
    const attendance = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Check employee exists
    const employee = employees.find(e => e.id === data.employeeId);
    if (!employee) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Employee not found ❌" }));
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    // Check already marked today
    const alreadyMarked = attendance.find(
      a => a.employeeId === data.employeeId && a.date === today
    );

    if (alreadyMarked) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Attendance already marked today ⚠️" }));
      return;
    }

    attendance.push({
      employeeId: data.employeeId,
      name: employee.name,
      date: today,
      time: new Date().toLocaleTimeString()
    });

    fs.writeFileSync(filePath, JSON.stringify(attendance, null, 2));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Attendance marked successfully ✅" }));
  });

  return;
}

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
  // GET /stats -> dashboard numbers
if (req.method === "GET" && req.url === "/stats") {
  const attendance = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // GET /stats -> dashboard numbers
if (req.method === "GET" && req.url === "/stats") {
  const attendance = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const employees = JSON.parse(fs.readFileSync(employeeFile, "utf8"));

  const totalEmployees = employees.length;
  const presentToday = Math.min(attendance.length, totalEmployees);
const absentToday = totalEmployees - presentToday;
  
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    totalEmployees,
    presentToday,
    absentToday
  }));
  return;
}

  const presentToday = attendance.length;
  const absentToday = totalEmployees - presentToday;

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    totalEmployees,
    presentToday,
    absentToday
  }));
  return;
}
  // POST /employees -> add employee
if (req.method === "POST" && req.url === "/employees") {
  let body = "";

  req.on("data", chunk => body += chunk.toString());

  req.on("end", () => {
    if (!body) {
      res.writeHead(400);
      res.end("Empty body");
      return;
    }

    const data = JSON.parse(body);

    let employees = [];
    try {
      employees = JSON.parse(fs.readFileSync(employeeFile, "utf8"));
    } catch {}

    const newEmployee = {
      id: Date.now(),
      name: data.name,
      role: data.role
    };

    employees.push(newEmployee);
    fs.writeFileSync(employeeFile, JSON.stringify(employees, null, 2));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      message: "Employee added successfully ✅"
    }));
  });

  return;
}

// GET /employees -> list employees
if (req.method === "GET" && req.url === "/employees") {
  const employees = JSON.parse(fs.readFileSync(employeeFile, "utf8"));
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(employees));
  return;
}

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});







