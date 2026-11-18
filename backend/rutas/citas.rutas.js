import express from "express";
import Cita from "../modelos/Cita.js";

const router = express.Router();

// Obtener TODAS las citas (para la opción "Listar Todas")
router.get("/", async (req, res) => {
  try {
    const citas = await Cita.find();
    res.json(citas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener todas las citas",
    });
  }
});
    
// Obtener citas por paciente (por DNI)
router.get("/:dni", async (req, res) => {
  try {
    const citas = await Cita.find({
      pacienteDNI: req.params.dni,
    });

    res.json(citas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener citas por paciente",
    });
  }
});

// Crear cita
router.post("/", async (req, res) => {
  try {
    // Verificar se se achega un ID válido para comprobar duplicados
    if (req.body._id && req.body._id.trim() !== "") {
      const citaExiste = await Cita.findOne({
        _id: req.body._id,
      });

      if (citaExiste) {
        return res.status(409).json({
          mensaje: "Ya existe un cita con ese ID",  //salida de error 409 conflicto
        });
      }
    } else {
      // Se non hai ID (creación nova), eliminámolo para que MongoDB xere o ObjectId
      delete req.body._id;
    }

    // Se non existe, créase unha nova cita   
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
      mensaje: "Error al modificar la cita",
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
      mensaje: "Error al eliminar la cita",
    });
  }
});

export default router;