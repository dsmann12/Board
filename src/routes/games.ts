import express from 'express';
import Game from '../models/game';

const router: express.Router = express.Router();

router.get('/', (req, res) => {
    let game = new Game(1, "Shadow of the Colossus", "A boy will fight giants for the woman he loves");

    let html: string = `<h1>${game.name}</h1>` +
        `<p>${game.summary}</p>`;
    res.send(html);
});

export default router;
