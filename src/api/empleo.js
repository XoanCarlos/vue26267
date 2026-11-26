import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Subir currículo en PDF
export async function subirCurriculum(datos) {
  const formData = new FormData();
  formData.append("nombre", datos.nombre);
  formData.append("apellidos", datos.apellidos);
  formData.append("email", datos.email || "");
  formData.append("telefono", datos.telefono || "");
  formData.append("puesto", datos.puesto || "");
  formData.append("observaciones", datos.observaciones || "");
  formData.append("curriculum", datos.archivo);

  const res = await axios.post(`${API_URL}/empleo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
