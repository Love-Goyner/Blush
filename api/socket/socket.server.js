import { Server } from "socket.io";

let io;

const connectedUsers = new Map();

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return next(new Error("Invalid User Id"));
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`user is connected with socket id ${socket.userId}`);
    connectedUsers.set(socket.userId, socket.id)

    socket.on("disconnect", () => {
        console.log(`user is disconnected with socket id ${socket.userId}`);
        connectedUsers.delete(socket.userId);
    })
    
  })
};

export const getIO = () => {
    if(!io){
        throw new Error ("Socket io is not isnitialized")
    }

    return io;
}

export const getConnectedUsers = () => {
    return connectedUsers
}
