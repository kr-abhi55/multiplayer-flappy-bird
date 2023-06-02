import { ActionType, GameObject, Player } from "../common";
import { ClientSocket } from "./ClientSocket";
import { JoinSocketImp } from "./JoinSocketImp";



export abstract class JoinSocket extends ClientSocket {
    abstract joinRoom(player: Player): void
    abstract sendAction(action: ActionType, data: any): void

    onJoinRoom(player: Player[]) { }
    onCloseRoom() { }

    onGameStart(gos: GameObject[]) { }
    onGameEnd() { }

    onStartWait() { }
    onEndWait() { }

    onGoAdd(go: GameObject) { }
    onGoRemove(goID: string) { }
    onGoUpdate(gos: GameObject[]) { }

    static create(url: string) {
        return new JoinSocketImp(url)
    }
}