import React, { createContext, useEffect, useState } from 'react';
import { socket } from '../../socketio';
import { SocketContextType, SocketProviderProps } from './SocketContext.types';

export const SocketContext = createContext<SocketContextType>({} as SocketContextType);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const socketEmit = async (event: string, payload: any) => {
    socket.connect();
    return socket.emit(event, payload);
  };

  const onConnect = () => setIsConnected(true);
  const onConnectError = (error: Error) => console.error('[SocketIO] Connection Error:', error.message);
  const onDisconnect = () => setIsConnected(false);

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return <SocketContext.Provider value={{ socket, isConnected, socketEmit }}>{children}</SocketContext.Provider>;
};
