import config from '../configs/dotenv.config';
import jwt from 'jsonwebtoken'

type InternalJwtPayload = {
  userId: string;
  userEmail: string;
}

export const generateInternalJwt = (payload: InternalJwtPayload) => {
  const jwtToken = jwt.sign(
    payload,
    config.JWT_SECRET,
    {
      issuer: config.JWT_ISSUER,
      expiresIn: "15m",
    }
  )
  return jwtToken
}

export const verifyInternalJwt = (token: string) => {
  const payload = jwt.verify(token, config.JWT_SECRET)
  return payload
}
