import { io } from "socket.io-client";

export const initSocket = async () => {
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL ??
    "https://realtime-code-editor-production-9ddd.up.railway.app";

  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };

  return io(BACKEND_URL, options);
};
