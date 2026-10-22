```vue
<template>
  <div class="xestion-citas">
    <h4>📅 Xestión de Citas 🩺</h4>

    <!-- Formulario para crear ou modificar unha cita -->
    <form @submit.prevent="guardarCita">

      <!-- Primeira fila: ID, data e limpar -->
      <div class="fila">
        <div class="campo campo-id">
          <input
            v-model="novaCita._id"
            type="text"
            placeholder="ID cita"
            disabled
            aria-label="ID da cita"
          />
        </div>

        <div class="campo campo-fecha">
          <input
            v-model="novaCita.fecha"
            type="date"
            required
            aria-label="Data da cita"
          />
        </div>

        <button
          type="button"
          @click="limpiaFormcita"
          class="btn-limpar"
          title="Limpar formulario"
          aria-label="Limpar formulario"
        >
          🧹
        </button>
      </div>

      <!-- Segunda fila: paciente e doctor -->
      <div class="fila">
        <div class="campo campo-paciente">
          <input
            v-model="novaCita.pacienteId"
            type="text"
            placeholder="ID do paciente"
            readonly
            aria-label="ID do paciente"
          />
        </div>

        <div class="campo campo-doctor">
          <input
            :value="
              doctorSeleccionado
                ? `${doctorSeleccionado.nomedoc} ${doctorSeleccionado.apeldoc}`
                : ''
            "
            placeholder="ID Doctor"
            readonly
            aria-label="Doctor seleccionado"
          />
        </div>
      </div>

      <!-- Terceira fila: hora, motivo e estado -->
      <div class="fila">
        <label style="margin-left: 10px;">Hora Cita: </label>
        <div class="campo campo-hora">
          <input
            v-model="novaCita.hora"
            type="time"
            required
            aria-label="Hora da cita"
          />
        </div>

        <div class="campo campo-motivo">
          <input
            v-model="novaCita.motivo"
            type="text"
            placeholder="Motivo da cita"
            required
          />
        </div>

        <div class="campo campo-estado">
          <select
            v-model="novaCita.estado"
            required
            aria-label="Estado da cita"
          >
            <option value="pendente">Pendente</option>
            <option value="confirmada">Confirmada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <!-- Cuarta fila: observacións -->
      <div class="fila">
        <div class="campo campo-observacions">
          <textarea
            v-model="novaCita.observacions"
            placeholder="Observacións adicionais"
            aria-label="Observacións adicionais"
          ></textarea>
        </div>
      </div>

      <!-- Gardar ou modificar a cita -->
      <button
        type="submit"
        class="btn-guardar"
        :disabled="
          novaCita.pacienteId === '' ||
          novaCita.doctorId === '' ||
          novaCita.fecha === '' ||
          novaCita.hora === '' ||
          novaCita.motivo.trim() === ''
        "
      >
        {{ editando ? "Modificar" : "Gardar" }}
      </button>
    </form>

    <!-- Listaxe de citas -->
    <h4 class="titulo-listaxe" >
      📋 Listaxe de Citas
      <button
        type="button"
        @click="recargarCitas"
        class="btn-recargar"
        title="Recargar citas"
        aria-label="Recargar citas"
      >
        ⟳
      </button>
    </h4>

    <table v-if="citas.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>Doctor</th>
          <th>Data</th>
          <th>Hora</th>
          <th>Motivo</th>
          <th>Estado</th>
          <th>Accións</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(cita, index) in citas" :key="cita._id">
          <td>{{ index + 1 }}</td>

          <td>
            {{ cita.pacienteId?.nomepac }}
            {{ cita.pacienteId?.apelpac }}
          </td>

          <td>
            {{ cita.doctorId?.nomedoc }}
            {{ cita.doctorId?.apeldoc }}
          </td>

          <td>{{ cita.fecha }}</td>
          <td>{{ cita.hora }}</td>
          <td>{{ cita.motivo }}</td>
          <td>{{ cita.estado }}</td>

          <td class="acciones">
            <button
              type="button"
              title="Editar"
              aria-label="Editar cita"
              @click="editarCita(index)"
            >
              ✏️
            </button>

            <button
              type="button"
              title="Eliminar"
              aria-label="Eliminar cita"
              @click="eliminarCita(index)"
            >
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>
      Non hai citas cargadas ou falla a conexión coa BBDD.
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import XestionDoctores from "./XestionDoctores.vue";

import {
  // getCitas,
  saveCita,
  modifyCita,
  deleteCita
} from "../api/citas.js";

import { getDoctores } from "../api/doctores.js";
import { alertaExito, alertaInfo } from "../utils/alertas.js";

// Variables reactivas
const citas = ref([]);
const doctores = ref([]);
const editando = ref(false);

const doctorSeleccionado = ref(null);
const mostrarSelectorDoctor = ref(false);

// Datos do formulario
const novaCita = reactive({
  _id: "",
  pacienteId: "",
  doctorId: "",
  fecha: "",
  hora: "",
  motivo: "",
  estado: "pendente",
  observacions: ""
});

// Cargar datos ao iniciar o compoñente
onMounted(async () => {
  await cargarDatos();
});

// Cargar doctores.
// A carga das citas queda pendente de activar getCitas.
async function cargarDatos() {
  try {
    doctores.value = await getDoctores();

    // citas.value = await getCitas();
  } catch (error) {
    console.error("Erro ao cargar os datos:", error);
  }
}

// Seleccionar un doctor
function seleccionarDoctor(doctor) {
  doctorSeleccionado.value = doctor;
  novaCita.doctorId = doctor._id;
  mostrarSelectorDoctor.value = false;
}

// Gardar ou modificar unha cita
async function guardarCita() {
  try {
    if (editando.value) {
      await modifyCita(novaCita._id, { ...novaCita });
      alertaExito("Cita modificada");
    } else {
      await saveCita({ ...novaCita });
      alertaExito("Cita gardada");
    }

    limpiaFormcita();
    await cargarDatos();
  } catch (error) {
    console.error("Erro ao gardar a cita:", error);
  }
}

// Cargar unha cita no formulario
function editarCita(index) {
  const cita = citas.value[index];

  const pacienteId = cita.pacienteId?._id ?? cita.pacienteId;
  const doctorId = cita.doctorId?._id ?? cita.doctorId;

  doctorSeleccionado.value =
    doctores.value.find(d => d._id === doctorId) ??
    (typeof cita.doctorId === "object" ? cita.doctorId : null);

  Object.assign(novaCita, {
    _id: cita._id,
    pacienteId,
    doctorId,
    fecha: cita.fecha,
    hora: cita.hora,
    motivo: cita.motivo,
    estado: cita.estado,
    observacions: cita.observacions ?? ""
  });

  editando.value = true;
}

// Eliminar unha cita
async function eliminarCita(index) {
  const cita = citas.value[index];

  try {
    await deleteCita(cita._id);
    alertaInfo("Cita eliminada");
    await cargarDatos();
  } catch (error) {
    console.error("Erro ao eliminar a cita:", error);
  }
}

// Recargar a listaxe
async function recargarCitas() {
  await cargarDatos();
}

// Limpar o formulario
function limpiaFormcita() {
  Object.assign(novaCita, {
    _id: "",
    pacienteId: "",
    doctorId: "",
    fecha: "",
    hora: "",
    motivo: "",
    estado: "pendente",
    observacions: ""
  });

  doctorSeleccionado.value = null;
  mostrarSelectorDoctor.value = false;
  editando.value = false;
}
</script>

<style scoped>
.xestion-citas {
  width: 100%;
  background: white;
  padding: 1rem;
  overflow: visible;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* Formulario */
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.fila {
  display: flex;
  gap: 0.7rem;
  width: 100%;
  align-items: center;
}

.campo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  box-sizing: border-box;
}

/* Distribución dos campos */
.campo-id {
  flex: 0 1 180px;
}

.campo-paciente,
.campo-doctor {
  flex: 1 1 150px;
}

.campo-fecha {
  flex: 0 0 190px;
  max-width: 190px;
}

.campo-fecha input {
  min-width: 0;
  width: 100%;
}

.campo-hora {
  flex: 0 1 150px;
}

.campo-motivo {
  flex: 2 1 250px;
}

.campo-estado {
  flex: 1 1 170px;
}

.campo-observacions {
  flex: 1;
  width: 100%;
}

.campo input,
.campo select,
.campo textarea {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font: inherit;
  background-color: white;
}

.campo textarea {
  resize: vertical;
  min-height: 75px;
}

.campo input:focus,
.campo select:focus,
.campo textarea:focus {
  outline: none;
  border-color: #1ec9a4;
  box-shadow: 0 0 0 2px rgba(30, 201, 164, 0.15);
}

/* Botón de limpar */
.btn-limpar {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
}

/* Botón de gardar */
.btn-guardar {
  background-color: #f0f3f7;
  color: black;
  border: 2px solid #1bb191;
  padding: 0.6rem 1.6rem;
  border-radius: 12px;
  cursor: pointer;
  margin: 0 auto;
  display: block;
  transition: background-color 0.2s;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #c8eacf;
}

.btn-guardar:disabled {
  background-color: #e0e0e0;
  color: #999;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Cabeceras */
h4 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  background-color: #1ec9a4;
  color: white;
  border-radius: 4px;
}

.titulo-listaxe {
  position: relative;
  margin-top: 1.5rem;
  justify-content: center;
  align-items: center;
}

.titulo-listaxe .btn-recargar {
  position: absolute;
  right: 0.5rem;
  width: 30px;
  height:30px;
  height:30px;
}
/* Táboa */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.85rem;
  border: 1px solid #ddd;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.65rem;
  text-align: left;
}

th {
  text-align: center;
  background-color: #f8f9fa;
  white-space: nowrap;
}

td {
  overflow-wrap: anywhere;
}

td button {
  cursor: pointer;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  padding: 0.25rem 0.4rem;
}

td button:hover {
  background-color: #e8f8f3;
}

.acciones {
  text-align: center;
  white-space: nowrap;
}

/* Adaptación a pantallas pequenas */
@media (max-width: 900px) {
  .fila {
    flex-wrap: wrap;
  }

  .campo-id,
  .campo-paciente,
  .campo-doctor,
  .campo-fecha,
  .campo-hora,
  .campo-motivo,
  .campo-estado {
    flex: 1 1 200px;
    max-width: none;
  }
}

@media (max-width: 600px) {
  .xestion-citas {
    padding: 0.75rem;
  }

  .fila {
    flex-direction: column;
    align-items: stretch;
    gap: 0.6rem;
  }

  .campo {
    width: 100%;
  }

  .campo-fecha input {
    width: 100%;
  }

  .btn-limpar {
    align-self: flex-end;
  }

  table {
    min-width: 850px;
  }

  .xestion-citas {
    overflow-x: auto;
  }
}
</style>
```