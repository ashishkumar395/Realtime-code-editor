import { io } from 'socket.io-client';

export const initSocket = () => {
  return io(
    process.env.REACT_APP_BACKEND_URL,
    {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      timeout: 20000,
    }
  );
};
