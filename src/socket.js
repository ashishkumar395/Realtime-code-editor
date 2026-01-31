import { io } from "socket.io-client";

export const initSocket = async () => {
  return io(
    process.env.REACT_APP_BACKEND_URL ||
      "https://realtime-code-editor-production-9ddd.up.railway.app",
    {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      timeout: 10000,
    }
  );
};
