import express from 'express';
import cors from 'cors';
import router from './routes';
import config from './configs/dotenv.config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use(router);

app.listen(config.PORT, async() => {
  console.log(`Problem Service Started on ${config.PORT}`);
});

