import express from "express";
import Doctor from "../modelos/Doctor.js";

const router = express.Router();
    
// Obtener todos
router.get("/", async (req, res) => {
  try {
    const doctores = await Doctor.find(); //es el select de sql

    res.json(doctores);
  } catch (error) {
    res.status(500).json({
      mensaje: ("Error al obtener doctores", error),
    });
  }
});

// Obtener doctores por especialidad
router.get("/:especialidad", async (req, res) => {
  try {
    const doctores = await Doctor.find({
      especialidad: req.params.especialidad,
    });

    res.json(doctores);
  } catch (error) {
    res.status(500).json({
      mensaje: ("Error al obtener doctores", error),
    });
  }
});

// Crear
router.post("/", async (req, res) => {
  try {
    // Verificar si ya existe un doctor con el mismo ID para no permitir duplicados
    const doctorExistente = await Doctor.findOne({
      iddoc: req.body.iddoc,
    });

    if (doctorExistente) {
      return res.status(409).json({
        mensaje: "Ya existe un doctor con ese ID",  //salida de error 409 conflicto
      });
    }

    // si no existe, se crea un nuevo doctor   
    const doctor = new Doctor(req.body);

    const nuevoDoctor = await doctor.save();

    res.status(201).json(nuevoDoctor);

  } catch (error) {
    console.error("ERROR AL CREAR DOCTOR:", error);

    res.status(500).json({
      mensaje: "Error al crear el doctor",
    });
  }
});



// Modificar doctor
router.put("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { iddoc: req.params.id },
      req.body,
      { new: true },
    );

    if (!doctor) {
      return res.status(404).json({
        mensaje: "Doctor no encontrado",
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      mensaje: ("Error al modificar el doctor", error),
    });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({
      iddoc: req.params.id,
    });

    if (!doctor) {
      return res.status(404).json({
        mensaje: "Doctor no encontrado",
      });
    }

    res.json({
      mensaje: "Doctor eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: ("Error al eliminar el doctor", error),
    });
  }
});

export default router;
