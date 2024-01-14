import { Like, Match, User } from "./types";
import StringGenerator from "./utils/string-generator";

class Room {
    likes: Like[];
    matches: Match[];
    users: User[];

    constructor() {
        this.likes = [];
        this.matches = [];
        this.users = [];
    }
    
    addLike(id: string): void {
        if(this.likes.filter(like => like.id === id).length > 0) {
            // match!

            // avoid double notifying for match
            if(this.matches.filter(match => match.id === id).length > 0)
                return;

            this.matches.push({
                id: id,
                time: new Date()
            });
        } else {
            this.likes.push({
                id
            })
        }
    }
    
    getMatchesSince(time: Date): Match[] {
        let filtered = this.matches.filter(match => match.time > time);

        return filtered;
    }

    addUser(): User {
        const maxTries = 50;
        const userIdLength = 8;

        let userid = "fallbackuser";
        
        for(let i = 0; i < maxTries; i++) {
            userid = "user-" + StringGenerator.generate(userIdLength);

            if(this.users.filter(user => user.id === userid).length == 0) {
                break;
            }
        }

        const user: User = {
            id: userid
        }

        this.users.push(user);

        return user;
    }
}

export default Room;