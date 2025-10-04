import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Port on which express is running
  PORT: parseInt(process.env.PORT!) || 5000,

  // Database connection string
  DATABASE_URI: process.env.DATABASE_URI!,

  // Internal JWT ISS
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_ISSUER: process.env.JWT_ISSUER || 'auth-service',

  // ClerkJS keys
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
};

export default config;
