// Game Model
// Represents a game in the database

class Game {
    id: Number;
    name: String;
    summary: String;
    cover: String;
    release: Date;
    // developer should be foreign key
    // publisher should be foreign key

    constructor(id: Number = 0, name = "", summary = "", cover = "", release = new Date()) {
        this.id = id;
        this.name = name;
        this.summary = summary;
        this.cover = cover;
        this.release = release;
    }
}

export default Game;
