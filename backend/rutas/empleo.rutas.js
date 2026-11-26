import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

// Creamos el enrutador de Express (montado en /api/empleo desde server.js)
const router = express.Router();

// En ES Modules ("type": "module") no existen __filename ni __dirname por defecto;
// los reconstruimos a partir de import.meta.url para trabajar con rutas absolutas seguras.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta de destino donde se guardarán los currículos: backend/empleo
const empleoDir = path.resolve(__dirname, "../empleo");

// Creamos la carpeta al cargar el módulo si no existe.
// recursive: true evita errores si ya existe o si faltan directorios intermedios.
fs.mkdirSync(empleoDir, { recursive: true });

/**
 * Sanitiza un texto (nombre o apellidos) para construir un nombre de archivo seguro.
 * Ejemplo: "José Ángel  Pérez-López" -> "jose_angel_perez_lopez"
 */
function sanitizarTexto(texto = "") {
  return texto
    .normalize("NFD") // Descompone letras acentuadas en letra base + tilde/diacrítico
    .replace(/[\u0300-\u036f]/g, "") // Elimina las marcas diacríticas (tildes, diéresis, etc.)
    .trim() // Quita espacios en blanco al inicio y al final
    .toLowerCase() // Convierte todo a minúsculas
    .replace(/[^a-z0-9]+/g, "_") // Sustituye cualquier carácter no alfanumérico (espacios, guiones, ñ, etc.) por "_"
    .replace(/^_+|_+$/g, ""); // Elimina guiones bajos sobrantes al principio o al final
}

// Configuración de Multer para procesar formularios multipart/form-data (subida de archivos)
const upload = multer({
  // Guardamos el archivo en memoria RAM (req.file.buffer) en vez de escribirlo directamente en disco.
  // Así podemos validar primero que nombre y apellidos sean válidos antes de crear el archivo final.
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Tamaño máximo permitido: 5 MB (en bytes)
  },
  // Filtro que decide si se acepta o rechaza el archivo antes de cargarlo por completo
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Comprobamos tanto el tipo MIME declarado como la extensión del archivo
    if (file.mimetype === "application/pdf" && ext === ".pdf") {
      cb(null, true); // Aceptar archivo
    } else {
      cb(new Error("Solo se permiten archivos en formato PDF.")); // Rechazar archivo con error
    }
  },
});

// Ruta POST /api/empleo: recibe un formulario con "nombre", "apellidos" y el archivo "curriculum"
router.post("/", (req, res) => {
  // Invocamos manualmente el middleware upload.single("curriculum") dentro de la ruta
  // para poder capturar y responder en JSON los errores propios de Multer (tamaño, tipo, etc.).
  upload.single("curriculum")(req, res, async (err) => {
    // 1. Gestión de errores producidos durante la lectura/validación del archivo
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          mensaje: "El archivo supera el tamaño máximo permitido de 5 MB.",
        });
      }
      return res.status(400).json({
        mensaje: err.message || "Error al procesar el archivo PDF.",
      });
    }

    // 2. Comprobamos que realmente se haya adjuntado un archivo en el campo "curriculum"
    if (!req.file) {
      return res.status(400).json({
        mensaje: "Debe adjuntar un archivo PDF con su currículo.",
      });
    }

    try {
      // 3. Multer ya ha parseado los campos de texto del formulario en req.body;
      // sanitizamos nombre y apellidos para formar un nombre de fichero seguro.
      const nombreLimpio = sanitizarTexto(req.body?.nombre);
      const apellidosLimpio = sanitizarTexto(req.body?.apellidos);

      // Si tras sanitizar alguno queda vacío, devolvemos 400 Bad Request
      if (!nombreLimpio || !apellidosLimpio) {
        return res.status(400).json({
          mensaje: "El nombre y los apellidos son obligatorios.",
        });
      }

      // 4. Construimos el nombre final del archivo y su ruta absoluta dentro de backend/empleo
      const nombreArchivo = `${nombreLimpio}_${apellidosLimpio}.pdf`;
      const rutaDestino = path.join(empleoDir, nombreArchivo);

      // 5. Escribimos el contenido binario (Buffer en memoria) al disco de forma asíncrona
      await fs.promises.writeFile(rutaDestino, req.file.buffer);

      // 6. Respondemos con 201 Created indicando el nombre del archivo guardado
      return res.status(201).json({
        mensaje: "Currículo recibido correctamente.",
        archivo: nombreArchivo,
      });
    } catch (error) {
      // Error inesperado al escribir en disco o procesar la petición
      console.error("ERROR AL GUARDAR CURRÍCULO:", error);
      return res.status(500).json({
        mensaje: "Error al guardar el currículo en el servidor.",
      });
    }
  });
});

export default router;
