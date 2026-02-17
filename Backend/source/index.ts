import express from "express";
import cors from "cors";
import authRoutes from "../routes/Auth";
import taskRoutes from "../routes/Tasks";
import taskBoardRoutes from "../routes/taskBoard"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { updateTaskRealTime } from "../webSockets/webSocketService";
const port = process.env.PORT || 3000;
dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/taskBoard",taskBoardRoutes);

const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_URL,
    credentials:true,
  }
});

httpServer.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


io.on("connection", (socket) => {
  socket.on("updateData", async (updateData) => {
    await updateTaskRealTime(socket, updateData);
  });
 
});
