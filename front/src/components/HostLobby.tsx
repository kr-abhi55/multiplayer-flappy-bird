
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Player } from "../ts/common";

export interface HostLobbyProps {
    players: Player[]
    player: Player
    onStart?: () => void
}
function Item({ player, isSelf }: { player: Player, isSelf: boolean }) {
    return (
        <div className="item">{player.name}{isSelf && "@me"}</div>
    )
}
export default function HostLobby(props: HostLobbyProps) {
    return (
        <div className="full lobby" >
            <div className="lobby-header">
                <div>
                    <button onClick={props.onStart}>Start</button>
                </div>
                <div className="lobby-title">
                    Host
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
