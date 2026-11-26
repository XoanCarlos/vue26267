import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const empleoDir = path.resolve(__dirname, "../empleo");

// Aseguramos que exista la carpeta backend/empleo
fs.mkdirSync(empleoDir, { recursive: true });

// Sanitiza texto para formar un nombre de archivo seguro
function sanitizarTexto(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB máximo
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype === "application/pdf" && ext === ".pdf") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos en formato PDF."));
    }
  },
});

// Subir currículo en PDF a backend/empleo
router.post("/", (req, res) => {
  upload.single("curriculum")(req, res, async (err) => {
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

    if (!req.file) {
      return res.status(400).json({
        mensaje: "Debe adjuntar un archivo PDF con su currículo.",
      });
    }

    try {
      const nombreLimpio = sanitizarTexto(req.body?.nombre);
      const apellidosLimpio = sanitizarTexto(req.body?.apellidos);

      if (!nombreLimpio || !apellidosLimpio) {
        return res.status(400).json({
          mensaje: "El nombre y los apellidos son obligatorios.",
        });
      }

      const nombreArchivo = `${nombreLimpio}_${apellidosLimpio}.pdf`;
      const rutaDestino = path.join(empleoDir, nombreArchivo);

      await fs.promises.writeFile(rutaDestino, req.file.buffer);

      return res.status(201).json({
        mensaje: "Currículo recibido correctamente.",
        archivo: nombreArchivo,
      });
    } catch (error) {
      console.error("ERROR AL GUARDAR CURRÍCULO:", error);
      return res.status(500).json({
        mensaje: "Error al guardar el currículo en el servidor.",
      });
    }
  });
});

export default router;
