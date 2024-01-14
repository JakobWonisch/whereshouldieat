
interface IRooms {

    addLike(id: string): void;
    getMatchesSince(time: Date): Match[]; 

}

export default IRooms;