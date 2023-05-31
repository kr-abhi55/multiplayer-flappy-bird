import { Room } from "./Room.js";
import { ServerSocket } from "./ServerSocket.js";
import WebSocket, { WebSocketServer } from "ws";
import http from 'http'
import { FlappySocketInfo, MessageType, SocketInfo } from "./common.js";
export class ServerSocketImp extends ServerSocket {
    wss: WebSocket.Server<WebSocket.WebSocket>
    private addCallback() {
        this.wss.on('connection', (ws) => {
            let socketInfo: SocketInfo = {
                ws: ws
            }
            console.log("socket connected")
            this.onSocketConnected(socketInfo)
            ws.on('message', (message) => {
                const info = socketInfo
                this.onMessage(info, JSON.parse(message.toString('utf-8')))
                socketInfo = info
            })
            ws.on('close', () => {
                console.log("socket dis-connected")
                const info = socketInfo
                this.onSocketDisconnected(socketInfo)
                socketInfo = info
            })
        })
        this.wss.on('listening', () => {
            this.onConnected()
        })
        this.wss.on('close', () => {
            this.onDisconnected()
        })
    }
    constructor(server: http.Server) {
        super()
        this.wss = new WebSocketServer({ server });
        this.addCallback()
    }
    sendMessage(ws: WebSocket.WebSocket, type: MessageType, data: any): void {
        ws.send(JSON.stringify({ type, data }))
    }
    onConnected(): void {
    }
    onDisconnected(): void {
    }
    onSocketConnected(socketInfo: SocketInfo): void {
    }
    onSocketDisconnected(socketInfo: SocketInfo): void {
    }
    onMessage(socketInfo: SocketInfo, message: any): void {
    }

}