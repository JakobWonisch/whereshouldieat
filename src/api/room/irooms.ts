import Room from "./room";
import { Match, User } from "./types";

interface IRooms {

    generateRoomId(): string;
    getRoom(roomid: string): Room;

}

export default IRooms;