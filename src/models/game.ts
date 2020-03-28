// Game Model
// Represents a game in the database
import Company from './company';
import Platform from './platform';

class Game {
    id: number;
    title: string;
    summary: string;
    cover: string;
    release: Date;
    genre: string;
    developer: Company;
    publisher: Company;
    platforms: Platform[];

    constructor(id: number, title: string, summary: string, cover: string,
                release: Date = new Date(), genre: string, developer: Company,
                publisher: Company, platforms: Platform[]) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.cover = cover;
        this.release = release;
        this.genre = genre;

        this.developer = developer;
        this.publisher = publisher;
        this.platforms = platforms;
    }
}

export default Game;
