import express from 'express';
import cors from 'cors';
import router from './routes';
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/', router);

export default app;
