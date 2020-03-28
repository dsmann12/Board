import express from 'express';
import Game from '../models/game';
import Company from '../models/company';
import Platform from '../models/platform';
import Config from '../config/config';
import apicalypse from 'apicalypse';
import pg from 'pg';

const router: express.Router = express.Router();
const config = new Config();

const database: pg.Client = new pg.Client({
    host: config.database_host,
    user: config.database_user,
    password: config.database_pw,
    database: config.database_db,
});

router.get('/', async (req, res) => {
    const requestOptions = {
        // queryMethod: 'url',
        queryMethod: 'body',
        baseURL: 'https://api-v3.igdb.com',
        headers: {
            accept : 'application/json',
            'user-key': config.igdb_api_key,
        },
        responseType: 'json',
        timeout: 10000, // 1 second timeout
    };

    try {
        // let query = req.query;
        database.connect();
        let query_response = await database
            .query("SELECT game.*, developers.company_id AS developer_id, \
                    developers.company_name AS developer_name, \
                    developers.description AS developer_description, \
                    developers.country AS developer_country, \
                    publishers.company_id AS publisher_id, \
                    publishers.company_name AS publisher_name, \
                    publishers.description AS publisher_description, \
                    publishers.country AS publisher_country FROM game \
                    INNER JOIN company developers \
                    ON game.developer = developers.company_id \
                    INNER JOIN company publishers \
                    ON game.publisher = publishers.company_id" );

        // res.send(response.data);
        res.send(query_response.rows);
    } catch (err) {
        console.log(err);
        res.send(err);
    } finally {
        database.end();
    }
});

export default router;
