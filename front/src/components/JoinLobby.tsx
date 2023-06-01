
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Player } from "../ts/common";
import { JoinSocket } from "../ts/socket/JoinSocket";

export interface LobbyProps {
    players: Player[]
    player: Player
}
function Item({ player, isSelf }: { player: Player, isSelf: boolean }) {
    return (
        <div className="item">{player.name}{isSelf && "@me"}</div>
    )
}
export default function JoinLobby(props: LobbyProps) {
    return (
        <div className="full lobby" >
            <div className="lobby-header">

                <div className="lobby-title">
                    Player
                </div>
                <div>Name:{props.player.name}</div>
                <div>RoomID:{props.player.roomID}</div>
            </div>
            <div className="lobby-list">
                <div>Players</div>
                <div className="lobby-list-main">
                    <Item player={props.player} isSelf={true} />
                    {props.players.map((player, i) => (
                        <Item key={i} player={player} isSelf={false} />
                    ))}
                </div>
            </div>
        </div>
    );
}
