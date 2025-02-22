import ERROR_MESSAGE from "../constants/error-message-constant";
import { BadRequestException } from "../exceptions";
import jwt from "jsonwebtoken";
import { get, isNull, isUndefined } from "lodash";

export const signJwt = (
  object: any,
  privateKey: string,
  options?: jwt.SignOptions | undefined
): string => {
  const key = privateKey.replace(/\\n/g, "\n");
  return jwt.sign(object, key, {
    ...(options && options),
    algorithm: "RS256"
  });
};

export const getJwtPrivateKey = (): string => {
  const jwtPrivateKey = get(process.env, "JWT_PRIVATE_KEY", "");
  if (isNull(jwtPrivateKey) || isUndefined(jwtPrivateKey)) {
    throw new BadRequestException({ message: ERROR_MESSAGE.JWT_PRIVATE_KEY });
  }
  return jwtPrivateKey;
};
