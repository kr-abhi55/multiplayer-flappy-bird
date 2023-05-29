import { useState } from "react"
import { useNavigate } from "react-router"
import { Utils } from "../Utils"

export default function Host() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [roomName, setRoomName] = useState("")
    async function handleCreate() {
        if (name.trim().length == 0 || roomName.trim().length == 0) {
            return alert("input can't be empty")
        }
        //check if room exist or not
        const { error, result } = await Utils.getJson("room/exist/" + roomName)
        if (error) {
            return navigate("/room", { state: { name, roomName, isHost: true } })
        }
        return alert(roomName+" already exist")
    }

    return (
        <div className="full host">
            <div className="host-box">
                <label className="host-label" htmlFor="">Host</label>
                <input onChange={(e) => setName(e.target.value)} type="text" placeholder="name" />
                <input onChange={(e) => setRoomName(e.target.value)} type="text" placeholder="room name" />
                <button onClick={handleCreate}>Create</button>
            </div>
        </div>
    )
}