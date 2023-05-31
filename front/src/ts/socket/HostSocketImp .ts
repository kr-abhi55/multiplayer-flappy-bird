import { ActionType, Player } from "../common";
import { ClientSocket } from "./ClientSocket";
import { ClientSocketImp } from "./ClientSocketImp";
import { HostSocket } from "./HostSocket";
import { JoinSocket } from "./JoinSocket";


export class HostSocketImp extends ClientSocketImp implements HostSocket {
    constructor(url: string) {
        super(url)
    }
    createRoom(player: Player): void {
        this.sendMessage("room/create", player)
    }
    onRoomCreated(): void {
    }
    onRoomClosed(): void {
    }
    onGameAction(type: ActionType, data: any): void {
    }
}