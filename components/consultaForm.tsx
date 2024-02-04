import { IAgentes } from "@/interfaces/IUserReponse";
import { useState } from "react";
import Card from "./cardAgente";
import { Button, OutlinedInput, Box, Alert, Snackbar } from "@mui/material";
import TextField from "@mui/material/TextField";

const ConsultaForm = () => {
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [resultado, setResultado] = useState<IAgentes | undefined>(undefined);
  const [existeInformacion, setExisteInformacion] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleClose = () => {
    setShowAlert(!showAlert);
  };

  const handleNumeroDocumentoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumeroDocumento(e.target.value);
  };

  const limpiarCampos = () => {
    setNumeroDocumento("");
    setResultado(undefined);
    setShowAlert(false);
  };

  const handleConsultaClick = async () => {
    console.log("", numeroDocumento);
    if (numeroDocumento === "") {
      return alert("Ingrese un nit para poder consultar la información!");
    }
    const responseToken = await fetch(`/api/token`);
    const { token } = await responseToken.json();
    const response = await fetch(`/api/consulta?documento=${numeroDocumento}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data: IAgentes = await response.json();
    limpiarCampos;
    if (data.nit !== undefined) {
      setResultado(data);
      setExisteInformacion(true);
      setShowAlert(false);
    } else {
      setResultado(undefined);
      setExisteInformacion(false);
      console.log("estoy aca en el else");
      setShowAlert(true);
    }
  };

  return (
    <div className=" bg-cyan-300 flex flex-col gap-4">
      <div className="bg-cyan-200 px-2">
        <TextField
          id="documento-input"
          label="Número de documento"
          variant="filled"
          value={numeroDocumento}
          onChange={handleNumeroDocumentoChange}
          fullWidth
        />
      </div>
      <div className="bg-cyan-300 flex justify-center gap-6 px-2">
        <button
          onClick={handleConsultaClick}
          className="bg-cyan-500 w-40 h-12 rounded-2xl font-bold "
        >
          Consultar
        </button>
        <button
          onClick={limpiarCampos}
          className="bg-amber-500 w-40 h-12 rounded-2xl font-bold "
        >
          Limpiar
        </button>
      </div>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          No se encontraron registros para los parámetros ingresados.
        </Alert>
      </Snackbar>
      <Box className="bg-amber-400">
        {resultado && <Card agente={resultado} />}
      </Box>
    </div>
  );
};

export default ConsultaForm;
