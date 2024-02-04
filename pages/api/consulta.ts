import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { verifiedToken } from "@/utils/tokenManager";
import { IAgentes } from "@/interfaces/IUserReponse";
import { IUser } from "@/interfaces/IUser";

dotenv.config();

type Data =
  | {
      error: string;
    }
  | IAgentes;

export default async function consultaHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      const numeroDocumento = req.query.documento;
      const { authorization } = req.headers;

      if (!authorization) return res.status(401).json({ error: "No Token" });
      const url = `${process.env.API_URL}${numeroDocumento}`;
      await verifiedToken(req, res);
      const response = await fetch(url);
      const {
        nit,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        cui,
      } = (await response.json()) as IUser;
      const dataAgente: IAgentes = {
        nit,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        cui,
      };
      res.status(200).json(dataAgente);
    } catch (error) {
      res.status(500).json({ error: "Error en el servidor" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
