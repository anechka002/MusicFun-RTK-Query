import { getSocket } from './getSocket.ts'
import type { Socket } from 'socket.io-client'
import type {SocketEvents} from "@/common/constans";

type Callback<T> = (data: T) => void

export const subscribeToEvents = <T>(event: SocketEvents, callback: Callback<T>) => {
  const socket: Socket = getSocket()
  socket.on(event, callback)

  return () => {
    socket.off(event, callback)
  }
}