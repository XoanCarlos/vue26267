import express from "express";
import fs from "fs";
import cors from "cors"; //evita bloqueos entre servidores
import "dotenv/config";
import { MongoClient } from "mongodb";  //importa módulo de conexion a mongodb

// Creamos la aplicación Express
const app = express();
app.use(cors());

//USA EL PUERTO definido en la variables de entorno y si no coge el 3000
const PORT = process.env.PORT || 3000;

//URL conexion con mongodb

const MONGO_URI = process.env.MONGO_URI;

//CREAMOS EL CLIENTE MONGODB o LA CADENA DE CONEXION
const client = new MongoClient(MONGO_URI);

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

async function iniciaServer(){
    try{
      //conectamos con mongodb
      await client.connect();
      console.log("Conectado a MongoDB");
      app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });
    } catch(error){
      console.error("error de conexion", error)
    }
  }

iniciaServer();
