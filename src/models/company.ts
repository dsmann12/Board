// Company Model
// Represents a company in the database

class Company {
    id: number;
    name: string;
    description?: string;
    country: number;

    constructor(id: number = 0,
                name: string = "",
                description?: string,
                country: number = 0) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.country = country;
    }
}

export default Company;
