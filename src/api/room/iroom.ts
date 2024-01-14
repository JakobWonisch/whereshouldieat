import { Match, User } from "./types";

interface IRoom {
    
    addUser(): User;
    addLike(id: string): void;
    getMatchesSince(time: Date): Match[];

}

export default IRoom;