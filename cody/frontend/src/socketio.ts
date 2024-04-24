import { io } from 'socket.io-client';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';
export const socket = io(serverURL, {
  transports: ['websocket'],
});
