"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: "*" },
    });
    /* ------------------ AUTH MIDDLEWARE ------------------ */
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            console.log("❌ No token");
            return next(new Error("Unauthorized"));
        }
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, user) => {
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
    io.on("connection", (socket) => {
        console.log("✅ Connected:", socket.data.userId);
        socket.on("joinChat", (chatId) => {
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
exports.initSocket = initSocket;
