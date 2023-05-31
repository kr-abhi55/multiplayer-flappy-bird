import WebSocket from "ws"
import { MessageType, SocketInfo } from "./common.js";
import http from 'http'
import { ServerSocketImp } from "./ServerSocketImp.js";

export abstract class ServerSocket {
  abstract onConnected(): void;

  abstract onDisconnected(): void;

  abstract onSocketConnected(socketInfo: SocketInfo): void;

  abstract onSocketDisconnected(socketInfo: SocketInfo): void;

  abstract onMessage(socketInfo: SocketInfo, message: any): void;
  abstract sendMessage(ws: WebSocket.WebSocket, type: MessageType, data: any): void;
  // abstract onHostMessage(socketInfo: SocketInfo, message: any): void;

  // abstract onPlayerMessage(socketInfo: SocketInfo, message: any): void;

  // static create<T extends ServerSocket>(SocketClass: new (server: http.Server) => T, server: http.Server): T {
  //   return new SocketClass(server);
  // }

}

