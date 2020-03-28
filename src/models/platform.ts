// Platform Model
// Represents a platform from the database

class Platform {
    id: number;
    name: string;
    abbreviation: string;
    generation?: number;

    constructor(id: number, name: string, abbreviation: string, generation?: number) {
        this.id = id;
        this.name = name;
        this.abbreviation = abbreviation;
        this.generation = generation;
    }
}

export default Platform;
