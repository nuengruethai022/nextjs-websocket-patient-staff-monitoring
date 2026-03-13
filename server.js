// server.js
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  // กำหนด CORS และ Path ให้ชัดเจน
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

  httpServer.listen(3000, () => {
    console.log("> Server ready on http://localhost:3000");
  });
});