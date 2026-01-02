import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  /* ------------------ AUTH MIDDLEWARE ------------------ */
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("❌ No token");
      return next(new Error("Unauthorized"));
    }

    jwt.verify(token, process.env.SECRET_KEY!, (err: Error | null, user: any) => {
      if (err) {
        console.log("❌ Invalid token");
        return next(new Error("Forbidden"));
      }

      socket.data.user = user;
      socket.data.userId = user.userId;
      next();
    });
  });

  /* ------------------ CONNECTION ------------------ */
  io.on("connection", (socket: Socket) => {
    console.log("✅ Connected:", socket.data.userId);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${socket.data.userId} joined ${chatId}`);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.chatId).emit("receiveMessage", {
        ...data,
        senderId: socket.data.userId,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.data.userId);
    });
  });
};
