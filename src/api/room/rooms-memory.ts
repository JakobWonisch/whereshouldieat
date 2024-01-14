import IRooms from "./irooms";
import Room from "./room";
import { Match, User } from "./types";
import StringGenerator from "./utils/string-generator";

class RoomsMemory implements IRooms {

    private static instance: IRooms;
    private rooms: Map<string, Room>;

    private constructor() {
        this.rooms = new Map<string, Room>();
    }

    getRoom(roomid: string): Room {
        const room = this.rooms.get(roomid);

        if(!room)
            throw new Error(`room ${roomid} does not exist`);

        return room;
    }

    generateRoomId(): string {
        const maxTries = 50;
        const roomIdLength = 8;

        for(let i = 0; i < maxTries; i++) {
            let roomid = "room-" + StringGenerator.generate(roomIdLength);

            if(!this.rooms.has(roomid)) {
                return roomid;
            }
        }

        return "fallbackroom";
    }

    public static getInstance() {
        if(!RoomsMemory.instance) {
            RoomsMemory.instance = new RoomsMemory();
        }

        return RoomsMemory.instance;
    }
    
}

export default RoomsMemory;