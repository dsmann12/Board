// User Model
// Represents a user in the database
import Game from './game';

class User {
    username: string;
    display_name: string;
    email: string;
    password: string;
    avatar: string;
    bio: string;
    birthday: Date | null;
    location: string;
    favorites: Game[];
    last_login: Date;


    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.display_name = "";
        this.avatar = "";
        this.bio = "";
        this.birthday = null;
        this.location = "";
        this.favorites = [];    // 
        this.last_login = new Date();
    }
}

export default User;
