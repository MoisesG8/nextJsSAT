import { generateToken, tokenVerificationErrors } from "@/utils/tokenManager";
import { jwtVerify } from "jose";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getToken(req, res);

    case "POST":
      return validateToken(req, res);

    default:
      return res.status(400).json({ message: "EndPoint no existe" });
  }
}

const getToken = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Generar el JWT token
    const { token, expiresIn } = generateToken("sat");
    res.status(200).json({ token, expiresIn });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

const validateToken = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw new Error("No Bearer");
    if (!token.toUpperCase().startsWith("BEARER")) throw new Error("No Bearer");

    // console.log(token.split(" ")[1]);
    // console.log(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(
      token.split(" ")[1],
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return res.status(200).json(payload);
  } catch (error: any) {
    console.error(error.message);

    if (error?.message && error.message === "No Bearer") {
      return res
        .status(401)
        .json({ error: "Utiliza formato Bearer", errors: error });
    }

    return res
      .status(401)
      .json({ error: tokenVerificationErrors[error.name], errors: error });
  }
};
