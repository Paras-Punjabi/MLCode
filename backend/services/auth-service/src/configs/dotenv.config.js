import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
}

export default {
  // Port on which express is running
  PORT: process.env.PORT || 5000,

  // Database connection string
  DATABASE_URI: process.env.DATABASE_URI,
};
