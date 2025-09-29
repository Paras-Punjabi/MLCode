import './configs/dotenv.config.js';
import app from './configs/express.config.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log('Server running at', PORT);
});
