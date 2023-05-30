import WebSocket from "ws"
import { SocketInfo } from "./common";

export abstract class ServerSocket {
    abstract onConnected(): void;

    abstract onDisconnected(): void;

    abstract onSocketConnected(socketInfo: SocketInfo): void;

    abstract onSocketDisconnected(socketInfo: SocketInfo): void;

    abstract onMessage(socketInfo: SocketInfo, message: any): void;

    abstract onHostMessage(socketInfo: SocketInfo, message: any): void;

    abstract onPlayerMessage(socketInfo: SocketInfo, message: any): void;
}


