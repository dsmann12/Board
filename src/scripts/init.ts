import apicalypse from 'apicalypse';
import Config from '../config/config';
import Game from '../models/game';
import Company from '../models/company';
import Platform from '../models/platform';
import pg from 'pg';

const config = new Config();

const database: pg.Client = new pg.Client({
    host: config.database_host,
    user: config.database_user,
    password: config.database_pw,
    database: config.database_db,
});

database.connect();
// 2207 - SOTC
// 73 - Mass Effect
// 74 - Mass Effect 2
// 231 - Half Life
// 233 - Half Life 2
// 71 - Portal
// 72 - Portal 2
// 375 - Metal Gear Solid
// 380 - Metal Gear Solid 4
// 379 - Metal Gear Solid 3
// 1352 - Journey
// 59 - Oblivion
// 472 - Skyrim
// 1103 - Super Metroid
// 1104 - Metroid Fusion
// 1107 - Metroid Zero Mission
// 2155 - Dark Souls
// 7334 - Bloodborne
// 14593 - Hollow Knight
// 11208 - Nier Automata
// 1561 - Pokemon Red
// 1513 - Pokemon Silver
// 427 - Final Fantasy VII
// 19560 - God of War (2018)
// 551 - God of War 2
// 499 - God of War 3
// 549 - God of War
// 1009 - The Last of Us
// 116 - KOTOR
// 2853 - Braid
// 740 - Halo
// 987 - Halo 3
// 621 - Call of Duty
// 622 - Call of Duty 2
// 623 - Call of Duty 4
// 624 - Call of Duty UO
// 7170 - Ico
// 731 - GTA 4
// 730 - GTA 3
// 732 - GTA: SA
// 434 - Red Dead Redemption
// 25076 - Red Dead Redemption 2
// 7170 - Ico
// 1942 - The Witcher 3
// 80 - The Witcher
// 478 - The Witcher 2
// 7331 - Uncharted 4
// 565 - Uncharted 2
// 117 - The Last Guardian
// 15 - Fallout 3
// 16 - Fallout New Vegas
// 523 - Infamous
// 20 - Bioshock
// 538 - Bioshock Infinite
// 2591 - Star Fox 64
let ids: number[] = [2207, 73, 74, 231, 233, 71, 72, 375, 380, 379,
                     1352, 59, 472, 1103, 1104, 1107, 2155, 7334,
                     14593, 11208, 1561, 1513, 427, 19560, 551, 449,
                     549, 1009, 116, 2853, 740, 987, 621, 622, 623,
                     624, 7170, 731, 730, 732, 434, 25076, 7170, 1942,
                     80, 478, 7331, 565, 117, 15, 16, 523, 20, 538, 2591]

const requestOptions = {
    queryMethod: 'body',
    baseURL: 'https://api-v3.igdb.com',
    headers: {
        accept: 'application/json',
        'user-key': config.igdb_api_key,
    },
    reponseType: 'json',
    timeout: 1000, // 1 second timeout
}

populate_db();

async function populate_db() {
    try {
        // get every 50 ids
        // console.log(`ids length: ${ids.length}`);
        let games: Game[] = [];
        for(let i:number = 0; i*50 < ids.length; ++i) {
            let ids_slice: number[] = ids.slice(i * 50);
            let id_string: string = "";

            ids_slice.forEach((id) => id_string += id + ', ');
            id_string = id_string.substring(0, id_string.length - 2);

            // console.log(`ids length: ${ids.length}`);
            // console.log(`id_string: ${id_string}`)
            // console.log(`ids_slice length: ${ids_slice.length}`);

            const response = await apicalypse(requestOptions)
                .fields('name, summary, cover.image_id, first_release_date, genres.name, involved_companies.company.*, involved_companies.developer, involved_companies.publisher, platforms.*')
                .where(`id = (${id_string})`)
                .limit(50)
                .request("/games");


            for (let obj of response.data) {
                let developer: Company = new Company();
                let publisher: Company = new Company();
                for (let involved_company of obj.involved_companies) {
                    if (involved_company.developer === true) {
                        developer = {
                            id: involved_company.company.id,
                            name: involved_company.company.name,
                            description: involved_company.company.description,
                            country: involved_company.company.country
                        };
                        break;
                    }
                }

                for (let involved_company of obj.involved_companies) {
                    if (involved_company.publisher === true) {
                        publisher = {
                            id: involved_company.company.id,
                            name: involved_company.company.name,
                            description: involved_company.company.description,
                            country: involved_company.company.country,
                        };
                        break;
                    }
                }

                let platforms: Platform[] = [];
                for (let obj_platform of obj.platforms) {
                    let platform: Platform = new Platform(obj_platform.id,
                                                        obj_platform.name,
                                                        obj_platform.abbreviation,
                                                        obj_platform.generation);
                    platforms.push(platform);
                }

                let game: Game = new Game(obj.id, obj.name, obj.summary,
                                        obj.cover.image_id,
                                        new Date(obj.first_release_date * 1000),
                                        obj.genres[0].name,
                                        developer,
                                        publisher,
                                        platforms);

                games.push(game);
            }
        }

        for(let game of games) {
            try {
                // insert each platform into databaseo
                for(let platform of game.platforms) {
                    let platform_response: pg.QueryResult<any> = await database
                        .query("INSERT INTO platform VALUES($1, $2, $3, $4) \
                                ON CONFLICT (platform_id) \
                                DO NOTHING",
                               [platform.id,
                                platform.name,
                                platform.abbreviation,
                                platform.generation]);
                    console.log("==============================================");
                    console.log("platform_response")
                    console.log("==============================================");
                    console.log(platform_response);
                    console.log();
                }

                // insert developer into database
                let developer_response: pg.QueryResult<any> = await database
                    .query("INSERT INTO company VALUES($1, $2, $3, $4) \
                            ON CONFLICT (company_id) \
                            DO NOTHING",
                           [game.developer.id,
                            game.developer.name,
                            game.developer.description,
                            game.developer.country]);
                console.log("==============================================");
                console.log("developer_response")
                console.log("==============================================");
                console.log(developer_response);
                console.log();

                // insert publisher into database
                let publisher_response: pg.QueryResult<any> = await database
                    .query("INSERT INTO company VALUES($1, $2, $3, $4) \
                            ON CONFLICT (company_id) \
                            DO NOTHING",
                           [game.publisher.id,
                            game.publisher.name,
                            game.publisher.description,
                            game.publisher.country]);
                console.log("==============================================");
                console.log("publisher_response")
                console.log("==============================================");
                console.log(publisher_response);
                console.log();

                // insert game into database
                let game_response: pg.QueryResult<any> = await database
                    .query("INSERT INTO game \
                                VALUES($1, $2, $3, $4, $5, $6, $7, $8) \
                                ON CONFLICT (game_id) \
                                DO NOTHING",
                               [game.id,
                                game.title,
                                game.summary,
                                game.cover,
                                game.release,
                                game.genre,
                                game.developer.id,
                                game.publisher.id]);

                console.log("==============================================");
                console.log("game_response")
                console.log("==============================================");
                console.log(game_response);
                console.log();

                // insert into on_platform
                for (let platform of game.platforms) {
                    let on_platform_response: pg.QueryResult<any> = await database
                        .query("INSERT INTO on_platform \
                                VALUES($1, $2) \
                                ON CONFLICT \
                                DO NOTHING",
                               [game.id,
                                platform.id]);
                    console.log("==============================================");
                    console.log("on_platform_response")
                    console.log("==============================================");
                    console.log(on_platform_response);
                    console.log();
                }

            } catch(err) {
                console.log(err);
            }
        }
        // console.log(games);
        // console.log('Length: ' + games.length);
        database.end();
    } catch(err) {
        console.log(err);
    }
}

