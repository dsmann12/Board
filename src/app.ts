// TypeScript version of require
import express from 'express';

const port: Number = 8080;

const app: express.Application = express();

// import routes
import games from './routes/games';

// bind routes to app's express router
app.use('/api/games', games);

app.get('/', (req, res) => {
    res.send("Hello, World!\n\nIt's time for TypeScript!");
});

app.get("*", (req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
