import express from 'express';

const port: Number = 8080;

const app: express.Application = express();

app.get('/', (req, res) => {
    res.send("Hello, World!\n\nIt's time for TypeScript!");
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

