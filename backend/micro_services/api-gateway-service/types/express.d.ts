import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      isMLCodeUser?: true;
      isAdmin?: boolean;
    }
  }

  interface CustomJwtSessionClaims {
    metadata: {
      isMLCodeUser?: true;
    };
  }
}
