import IRooms from "./irooms";
import Room from "./room";
import { Match, User } from "./types";
import StringGenerator from "./utils/string-generator";

class RoomsMemory implements IRooms {

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

        let roomid = "fallbackroom";

        for(let i = 0; i < maxTries; i++) {
            roomid = "room-" + StringGenerator.generate(roomIdLength);

            if(!this.rooms.has(roomid)) {
                break;
            }
        }

        this.rooms.set(roomid, new Room());

        console.log(`rooms: ${this.rooms.get(roomid)}`)

        return roomid;
    }

    public static getInstance() {
        if(!(global as any).roomsInstance) {
            console.error("instantiating rooms");
            (global as any).roomsInstance = new RoomsMemory();
        }

        return (global as any).roomsInstance;
    }
    
}

export default RoomsMemory;