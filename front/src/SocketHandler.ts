import { Player } from "./Utils";

type MessageType = "create/room" | "join/room" | "room/closed" | "get/rooms" | "go/add" | "go/update" | "go/delete" |
    "remove-player" | "add-player"
export default class SocketHandler {
    private wSocket: WebSocket
    private _onConnectedFun: (() => void)[] = []
    private addObserver() {
        this.wSocket.addEventListener('open', () => {
            console.log('Socket connected');
            this._onConnectedFun.forEach((e) => {
                e()
            })
        });
        this.wSocket.addEventListener('message', (e) => {
            const { type, data } = JSON.parse(e.data);
            console.log(type, data)
        })
        this.wSocket.addEventListener('close', () => {
            console.log('Socket closed');
        });
    }
    constructor(url: string) {
        this.wSocket = new WebSocket(url)
        this.addObserver()
    }
    close() {
        if (this.wSocket.readyState == 1) {
            this.wSocket.close()
        }
    }
    setOnConnectedListener(fun: () => void) {
        this._onConnectedFun.push(fun)
    }
    createRoom(player: Player) {
        this.sendMessage("create/room", player)
    }
    sendMessage(type: MessageType, data: any) {
        this.wSocket.send(JSON.stringify({ type, data }))
    }

}