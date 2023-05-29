import { useState } from "react"
import { useNavigate } from "react-router"
import { Utils } from "../Utils"

export default function Join() {

    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [roomName, setRoomName] = useState("")
    async function handleJoin() {
        if (name.trim().length == 0 || roomName.trim().length == 0) {
            alert("input can't be empty")
        }
        //check if room exist or not
        const { error, result } = await Utils.getJson("room/" + roomName)
        if (result) {
            return navigate("/room", { state: { name, roomName, isHost: false } })
        }
        return alert(roomName+" not exist")
    }

    return (
        <div className="full join">
            <div className="join-box">
                <label className="join-label" htmlFor="">Join</label>
                <input onChange={(e) => setName(e.target.value)} type="text" placeholder="name" />
                <input onChange={(e) => setRoomName(e.target.value)} type="text" placeholder="room name" />
                <button onClick={handleJoin}>Join</button>
            </div>
        </div>
    )
}