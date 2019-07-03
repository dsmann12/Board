// game object
// represents a game in the database

class Game {
    id: Number;
    name: String;
    summary: String;
    cover: String;
    release: String;

    constructor(id: Number = NaN, name = "", summary = "", cover = "", release = "") {
        this.id = id;
        this.name = name;
        this.summary = summary;
        this.cover = cover;
        this.release = release;
    }
}

export default Game;
