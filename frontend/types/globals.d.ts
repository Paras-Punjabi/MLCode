export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      isMLCodeUser?: true;
    };
  }
}
