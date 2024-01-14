import IRooms from "./irooms";
import RoomsMemory from "./rooms-memory";

class RoomsProvider {

    public static getRooms(): IRooms {
        return RoomsMemory.getInstance();
    }

}

export default RoomsProvider;