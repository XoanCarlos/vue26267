import express from "express";
import Cita from "../modelos/Cita.js";

const router = express.Router();
    
// Obtener citas por paciente
router.get("/:dni", async (req, res) => {
  try {
    const citas = await Cita.find({
      pacienteDNI: req.params.dni,
    });

    res.json(citas);
  } catch (error) {
    res.status(500).json({
      mensaje: ("Error al obtener doctores", error),
    });
  }
});

// Crear cita
router.post("/", async (req, res) => {
  try {
    // Verificar si ya existe un cita con el mismo ID para no permitir duplicados
    const citaExiste = await Cita.findOne({
      _id: req.body._id,
    });

    if (citaExiste) {
      return res.status(409).json({
        mensaje: "Ya existe un cita con ese ID",  //salida de error 409 conflicto
      });
    }

    // si no existe, se crea un nuevo cita   
    const cita = new Cita(req.body);

    const nuevaCita = await cita.save();

    res.status(201).json(nuevaCita);

  } catch (error) {
    console.error("ERROR AL CREAR Cita:", error);

    res.status(500).json({
      mensaje: "Error al crear el Cita",
    });
  }
});


// Modificar cita
router.put("/:id", async (req, res) => {
  try {
    const cita = await Cita.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
    );

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrado",
      });
    }

    res.json(cita);
  } catch (error) {
    res.status(500).json({
      mensaje: ("Error al modificar el cita", error),
    });
  }
});

// Eliminar cita

router.delete("/:id", async (req, res) => {
  try {
    const cita = await Cita.findOneAndDelete({
      _id: req.params.id,
    });

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrado",
      });
    }
    res.json({
      mensaje: "Cita eliminada",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: ("Error al eliminar el cita", error),
    });
  }
});

export default router;
