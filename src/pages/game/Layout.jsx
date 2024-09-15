import { Outlet } from "react-router-dom";
import { useRoom } from "../../contexts/RoomContext";

export default function Layout() {
    const { currentRoomId } = useRoom();
    return (
        <div>
            <Outlet />
        </div>
    )
}