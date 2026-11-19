import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
  pacienteDNI: { type: String, required: true },
  doctorId: { type: String, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  motivo: { type: String, required: true },
  estado: { type: String, required: true },
  diagnostico: { type: String, default: "" },
  tratamento: { type: String, default: "" },
  tarifa: { type: Number, default: 0 }
});

// Asegúrate de que esté exportado por defecto así:
export default mongoose.model("Cita", citaSchema);