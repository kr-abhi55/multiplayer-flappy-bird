import { useNavigate } from "react-router";

export default function Options() {
    const navigate = useNavigate()
    function handleJoin() {
        navigate("/join")
    }
    function handleHost() {
        navigate("/host")
    }
    return (
        <div className="full options">
            <button onClick={handleJoin} >Join</button>
            <button onClick={handleHost}>Host</button>
        </div>
    );
}