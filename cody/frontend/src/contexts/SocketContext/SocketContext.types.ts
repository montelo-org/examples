import { ReactNode } from 'react';
import { socket } from '../../socketio';

export type SocketProviderProps = {
  children: ReactNode;
};

export interface SocketContextType {
  socket: typeof socket;
  isConnected: boolean;
  socketEmit: (event: string, payload: any) => any;
}
