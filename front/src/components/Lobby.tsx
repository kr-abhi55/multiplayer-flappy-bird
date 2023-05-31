/*
import { useEffect, useState } from "react";
import SocketHandler, { EventCallback } from "../SocketHandler";
import { Player, Utils } from "../ts/Utils";
import { useNavigate } from "react-router";

export interface LobbyProps {
    players: Player[]
    player: Player
    socket: SocketHandler,
    onStart?: () => void
}
function Item({ player, isSelf }: { player: Player, isSelf: boolean }) {
    return (
        <div className="item">{player.name}{player.isHost && "@host"}{isSelf && "@me"}</div>
    )
}
export default function Lobby(props: LobbyProps) {
    return (
        <div className="full lobby" >
            <div className="lobby-header">
                {props.player.isHost && (
                    <div>
                        <button onClick={props.onStart}>Start</button>
                    </div>
                )}
                <div className="lobby-title">
                    {props.player.isHost ? "Host" : "Player"}
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
*/