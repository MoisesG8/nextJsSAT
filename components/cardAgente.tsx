import { IAgentes } from "@/interfaces/IUserReponse";
import { link } from "fs";
import React from "react";

interface CardProps {
  agente: IAgentes;
}

const Card: React.FC<CardProps> = ({ agente }) => {
  const {
    cui,
    nit,
    primerApellido,
    primerNombre,
    segundoApellido,
    segundoNombre,
  } = agente;
  return (
    <div className="shadow-lg rounded-xl bg-slate-200 mx-4 p-3 h-24">
      <div className="flex flex-col h-full items-center justify-evenly">
        <div>
          <p className="font-bold text-lg text-center">
            {primerNombre} {segundoNombre} {primerApellido} {segundoApellido}
          </p>
        </div>
        <div className="flex gap-8">
          <div className="flex">
            <p className="font-bold mr-2">NIT:</p>
            <p>{nit}</p>
          </div>
          <div className="flex">
            <p className="font-bold mr-2">CUI:</p>
            <p>{cui}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
