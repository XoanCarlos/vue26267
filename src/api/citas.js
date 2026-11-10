import axios from "axios";

const API_URL = "http://localhost:3000/api/citas";
const API_URL_2 = "http://localhost:3000/api/doctores"


export async function getCitasPaciente(dnipac) {
  const respuesta = await axios.get(`${API_URL}/${dnipac}`)
  return respuesta.data
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
