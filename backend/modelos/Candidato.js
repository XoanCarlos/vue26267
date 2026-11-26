// modelo candidato

import mongoose from "mongoose";

const CandidatoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    telefono: { type: String, default: "", trim: true },
    puesto: { type: String, default: "", trim: true },
    observaciones: { type: String, default: "", trim: true },
    archivo: { type: String, required: true, trim: true },
  },
  {
    collection: "candidatos",
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

export default mongoose.model("Candidato", CandidatoSchema);
