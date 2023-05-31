import { ActionType, MessageType, Player } from "../common";
import { ClientSocketImp } from "./ClientSocketImp";
import { HostSocket } from "./HostSocket";


export class HostSocketImp extends ClientSocketImp implements HostSocket {
    constructor(url: string) {
        super(url)
    }
    createRoom(player: Player): void {
        this.sendMessage("room/create", player)
    }
    onMessage(type: MessageType, data: any): void {
        super.onMessage(type, data)
        switch (type) {
            case "room/created":
                this.onRoomCreated()
                break;
            case "room/closed":
                this.onRoomClosed()
                break;

            default:
                break;
        }
    }
    onRoomCreated(): void {
    }
    onRoomClosed(): void {
    }
    onGameAction(type: ActionType, data: any): void {
    }
}