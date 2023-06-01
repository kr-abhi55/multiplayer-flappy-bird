import { MessageType } from "../common";
import { ClientSocket } from "./ClientSocket";


export class ClientSocketImp extends ClientSocket {
    protected wSocket: WebSocket
    protected addCallback() {
        this.wSocket.addEventListener('open', () => {
            console.log('Socket connected');
            this.onConnected()
        });
        this.wSocket.addEventListener('message', (e) => {
            const { type, data } = JSON.parse(e.data);
            this.onMessage(type, data)
        })
        this.wSocket.addEventListener('close', () => {
            console.log('Socket closed');
            this.onDisConnected()
        });
    }
    constructor(url: string) {
        super()
        this.wSocket = new WebSocket(url)
        this.addCallback()
    }
    close(): void {
        if (this.wSocket.readyState != 1) {
            this.wSocket.addEventListener('open', () => {
                this.wSocket.close()
            });
        } else {
            this.wSocket.close()
        }
    }

    sendMessage(type: MessageType, data: any): void {
        this.wSocket.send(JSON.stringify({ type, data }))
    }
    onMessage(type: MessageType, data: any): void {
        switch (type) {
            case "player/add":
                this.onAddPlayer(data)
                break;
            case "player/remove":
                this.onRemovePlayer(data)
                break;

            default:
                break;
        }
    }

}