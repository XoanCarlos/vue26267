import express from "express";
import fs from "fs";
import cors from "cors"; //evita bloqueos entre servidores

// Creamos la aplicación Express
const app = express();
app.use(cors());
const PORT = 3000;

// Ruta de la API para obtener provincias y municipios
app.get("/api/municipios", (req, res) => {
  console.log("petición recibida");

  // Leemos el fichero JSON
  const datos = fs.readFileSync("./backend/data/municipios.json", "utf8");

  // Convertimos el texto JSON en un objeto JavaScript
  const datosJson = JSON.parse(datos);

  // Enviamos los datos como respuesta al cliente
  res.json(datosJson);
});

// Ponemos el servidor a escuchar en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
