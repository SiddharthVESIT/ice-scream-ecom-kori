import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Gateway entrypoint
app.use('/api/v1', apiRouter);

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Unexpected server error' });
});

export default app;
