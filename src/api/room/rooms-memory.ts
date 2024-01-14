import IRooms from "./irooms";

class RoomsMemory implements IRooms {

    private static instance: IRooms;

    private constructor() {}

    public static getInstance() {
        if(!RoomsMemory.instance) {
            RoomsMemory.instance = new RoomsMemory();
        }

        return RoomsMemory.instance;
    }
    
    addLike(id: string): void {
        throw new Error("Method not implemented.");
    }
    
    getMatchesSince(time: Date): Match[] {
        throw new Error("Method not implemented.");
    }

}

export default RoomsMemory;