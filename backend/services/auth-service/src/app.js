import config from './configs/dotenv.config.js';

import express from 'express';
import cors from 'cors';
import routes from '../routes/index.js';

const app = express();

// TODO: config for dev and prod
app.use(cors());

app.use(routes);

export default app;

app.listen(config.PORT, async () => {
  console.log('Auth service running at', config.PORT);
});
