import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      isMLCodeUser?: true;
    }
  }

  interface CustomJwtSessionClaims {
    metadata: {
      isMLCodeUser?: true;
    };
  }
}
