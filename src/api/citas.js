import axios from "axios";
import { getDoctores } from "./doctores.js"

const API_URL = "http://localhost:3000/api/citas";

// Obtener citas de un paciente
export async function getCitasPaciente(dnipac) {

  const respuesta = await axios.get(`${API_URL}/${dnipac}`);

  const citas = respuesta.data;

  const doctores = await getDoctores();

  const citasCompletas = citas.map(cita => {

    const doctor = doctores.find(doc => doc._id === cita.doctorId);

    return {
      ...cita,
      nomedoc: doctor?.nomedoc || "",
      apeldoc: doctor?.apeldoc || "",
      espedoc: doctor?.espedoc || ""
    };

  });
  console.log(citasCompletas)
  return citasCompletas;
}

export async function saveCita(cita) {
  const respuesta = await axios.post(API_URL, cita);
  return respuesta.data;
}

export async function modifyCita(id, cita) {
  const respuesta = await axios.put(`${API_URL}/${id}`, cita);
  return respuesta.data;
}

export async function deleteCita(id) {
  const respuesta = await axios.delete(`${API_URL}/${id}`);
  return respuesta.data;
}
