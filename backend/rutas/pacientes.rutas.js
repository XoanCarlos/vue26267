import express from "express";
import Paciente from "../modelos/Paciente.js";

const router = express.Router();


// Obtener todos
router.get("/", async (req, res) => {
    try {
        const pacientes = await Paciente.find();  //es el select de sql

        res.json(pacientes);

    } catch (error) {

        res.status(500).json({
            mensaje: ("Error al obtener pacientes", error)
        });
    }
});


// Obtener uno
router.get("/:dni", async (req, res) => {
    try {
        const paciente = await Paciente.findOne({
            dnipac: req.params.dni
        });

        if (!paciente) {
            return res.status(404).json({
                mensaje: "Paciente no encontrado"
            });
        }

        res.json(paciente);

    } catch (error) {

        res.status(500).json({
            mensaje: ("Error al obtener el paciente", error)
        });
    }
});


// Crear
router.post("/", async (req, res) => {
    try {

        const paciente = new Paciente(req.body);

        const nuevoPaciente = await paciente.save();

        res.status(201).json(nuevoPaciente);

    } catch (error) {
        console.error("ERROR AL CREAR PACIENTE:", error);

        res.status(500).json({
            mensaje: "Error al crear el paciente"
        });
    }
});

// Modificar paciente
router.put("/:dni", async (req, res) => {
    try {
        const paciente = await Paciente.findOneAndUpdate(
            { dnipac: req.params.dni },
            req.body,
            { new: true }
        );

        if (!paciente) {
            return res.status(404).json({
                mensaje: "Paciente no encontrado"
            });
        }

        res.json(paciente);

    } catch (error) {

        res.status(500).json({
            mensaje: ("Error al modificar el paciente", error)
        });
    }
});


// Eliminar
router.delete("/:dni", async (req, res) => {
    try {
        const paciente = await Paciente.findOneAndDelete({
            dnipac: req.params.dni
        });

        if (!paciente) {
            return res.status(404).json({
                mensaje: "Paciente no encontrado"
            });
        }

        res.json({
            mensaje: "Paciente eliminado"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: ("Error al eliminar el paciente", error)
        });
    }
});


export default router;