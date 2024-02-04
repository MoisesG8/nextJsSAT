import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { NextApiRequest, NextApiResponse } from "next";

interface tokenResponse {
  token: string;
  expiresIn: string;
}

export const generateToken = (uid: string): tokenResponse | any => {
  try {
    const expiresIn = "30s";
    const token = jwt.sign({ uid }, process.env.JWT_SECRET!, { expiresIn });
    return { token, expiresIn };
  } catch (error: any) {
    console.error(error?.message);
  }
};

export const verifiedToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw new Error("No Bearer");
    if (!token.toUpperCase().startsWith("BEARER")) throw new Error("No Bearer");

    const { payload } = await jwtVerify(
      token.split(" ")[1],
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload;
  } catch (error: any) {
    console.error(error.message);

    if (error?.message && error.message === "No Bearer") {
      return res
        .status(401)
        .json({ error: "Utiliza formato Bearer", errors: error });
    }
    //const { name } = error as { name: string };

    return res
      .status(401)
      .json({ error: tokenVerificationErrors[error.name], errors: error });
  }
};

export const tokenVerificationErrors: any = {
  "invalid signature": "La firma del JWT no es válida",
  "jwt expired": "JWT expirado",
  "invalid token": "Token no valido",
  "No Bearer": "Utiliza formato Bearer",
  "jwt malformed": "JWT formato no valido",
  JWTExpired: "JWT expirado",
  JWSSignatureVerificationFailed: "La firma del JWT no es válida",
  JWSInvalid: "Token no valido",
  error: "Error en el servidor",
};
