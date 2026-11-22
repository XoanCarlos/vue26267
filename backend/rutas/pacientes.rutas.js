import express from "express";
import Paciente from "../modelos/Paciente.js";

const router = express.Router();

// Obtener todos
router.get("/", async (req, res) => {
  try {
    const pacientes = await Paciente.find(); // es el select de sql
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener pacientes",
      error: error.message,
    });
  }
});

// Obtener uno
router.get("/:dni", async (req, res) => {
  try {
    const dni = req.params.dni.trim().toUpperCase();
    const paciente = await Paciente.findOne({ dnipac: dni });

    if (!paciente) {
      return res.status(404).json({
        mensaje: "Paciente no encontrado",
      });
    }

    res.json(paciente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el paciente",
      error: error.message,
    });
  }
});

// Crear
router.post("/", async (req, res) => {
  try {
    if (!req.body.dnipac || req.body.dnipac.trim() === "") {
      return res.status(400).json({
        mensaje: "El DNI del paciente es obligatorio",
      });
    }

    const dni = req.body.dnipac.trim().toUpperCase();

    // Verificar si ya existe un paciente con el mismo DNI para no permitir duplicados
    const pacienteExistente = await Paciente.findOne({ dnipac: dni });

    if (pacienteExistente) {
      return res.status(409).json({
        mensaje: "Ya existe un paciente con ese DNI", // salida de error 409 conflicto
      });
    }

    // Si no existe, se crea un nuevo paciente
    const datosPaciente = {
      ...req.body,
      dnipac: dni,
    };

    const paciente = new Paciente(datosPaciente);
    const nuevoPaciente = await paciente.save();

    res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error("ERROR AL CREAR PACIENTE:", error);
    res.status(500).json({
      mensaje: "Error al crear el paciente",
      error: error.message,
    });
  }
});

// Modificar paciente
router.put("/:dni", async (req, res) => {
  try {
    const dni = req.params.dni.trim().toUpperCase();

    if (req.body.dnipac) {
      req.body.dnipac = req.body.dnipac.trim().toUpperCase();
    }

    const paciente = await Paciente.findOneAndUpdate(
      { dnipac: dni },
      req.body,
      { new: true, runValidators: true },
    );

    if (!paciente) {
      return res.status(404).json({
        mensaje: "Paciente no encontrado",
      });
    }

    res.json(paciente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el paciente",
      error: error.message,
    });
  }
});

// Eliminar
router.delete("/:dni", async (req, res) => {
  try {
    const dni = req.params.dni.trim().toUpperCase();
    const paciente = await Paciente.findOneAndDelete({ dnipac: dni });

    if (!paciente) {
      return res.status(404).json({
        mensaje: "Paciente no encontrado",
      });
    }

    res.json({
      mensaje: "Paciente eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el paciente",
      error: error.message,
    });
  }
});
// Exportar el router
export default router;
