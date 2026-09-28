import axios from "axios"

//en produccion se usa la url del servidor
//const API_URL = "https://servidor.com/api";

const API_URL = "http://localhost:3000/api";

// Guardar paciente
export async function savePaciente(paciente) {
    const res = await axios.post(`${API_URL}/pacientes`, paciente);
    return res.data;
}

// Obtener todos los pacientes
export async function getPacientes() {
    const res = await axios.get(`${API_URL}/pacientes`);
    return res.data;
}

// Obtener un paciente por DNI
export async function getPacientePorDNI(dni) {
    const res = await axios.get(`${API_URL}/pacientes/${dni}`);
    return res.data;
} 

// Actualizar paciente
export async function modifyPaciente(dni, paciente) {
    const res = await axios.put(`${API_URL}/pacientes/${dni}`, paciente);
    return res.data;
}   

// Eliminar paciente
export async function deletePaciente(dni) {
    const res = await axios.delete(`${API_URL}/pacientes/${dni}`);
    return res.data;
}
