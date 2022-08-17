/**
 * JWTPayload Interface.
 */
interface JWTPayload {
  name: string;
  email: string;
  userId: number;
}

export default JWTPayload;
