import express from 'express';
import studentRoutes from "./routes/studentRoutes.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(studentRoutes);
app.use((req, res) => {
    res.status(404).type('text/plain; charset=utf-8').send('Not Found');
})

app.listen(port, () => {
    console.log(`Server started on port ${port}. Press Ctrl-C to finish`);
})