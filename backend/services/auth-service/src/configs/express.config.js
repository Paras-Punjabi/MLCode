import express from 'express';
import cors from 'cors';
import routes from '../routes/index.js';

const app = express();

// TODO: config for dev and prod
app.use(cors());

app.use(routes);

export default app;
