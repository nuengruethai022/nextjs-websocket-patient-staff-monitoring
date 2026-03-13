// server.js
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
// เพิ่มการจัดการ hostname เพื่อให้รองรับการรันบน Cloud
const hostname = "0.0.0.0"; 
// สำคัญมาก: เปลี่ยนจาก 3000 เป็น process.env.PORT
const port = process.env.PORT || 3000; 

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket Connected:", socket.id);
    
    socket.on("update-patient-data", (data) => {
      io.emit("receive-patient-data", data);
    });
  });

  // เปลี่ยนมาใช้ตัวแปร port ที่เรารับมาจากระบบ
  httpServer.listen(port, () => {
    console.log(`> Server ready on port ${port}`);
  });
});