<template>
  <div class="w-full bg-white p-4 rounded shadow-md box-border text-gray-800">
    <h4 class="text-lg font-semibold bg-[#1ec9a4] text-white py-2 px-4 rounded mb-4 text-center">
      📅 Xestión de Citas 🩺
    </h4>

    <!-- Formulario para crear ou modificar unha cita -->
    <form @submit.prevent="guardarCita" class="w-full flex flex-col gap-3.5 mb-6">
      <!-- Primeira fila: ID, data e limpar -->
      <div class="flex flex-col md:flex-row gap-2.5 w-full items-stretch md:items-center">
        <div class="flex items-center gap-1 flex-1">
          <label class="w-20 shrink-0 text-sm font-semibold text-gray-700">ID Cita:</label>
          <input
            v-model="novaCita._id"
            type="text"
            placeholder="ID cita"
            disabled
            aria-label="ID da cita"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 text-center  rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed box-border"
          />
        </div>
        <div class="flex items-center gap-1 flex-1">
          <label class="w-20 shrink-0 text-sm font-semibold text-gray-700">Paciente:</label>
          <input
            v-model="novaCita.pacienteId"
            type="text"
            placeholder="DNI do paciente"
            readonly
            aria-label="DNI do paciente"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none text-center box-border"
          />
        </div>
        <div class="flex items-center gap-2 flex-1">
          <label class="w-16 shrink-0 text-sm font-semibold text-gray-700">Doctor:</label>
          <input
            :value="
              doctorSeleccionado
                ? `${doctorSeleccionado.nomedoc} ${doctorSeleccionado.apeldoc}`
                : ''
            "
            placeholder="ID Doctor"
            readonly
            aria-label="Doctor seleccionado"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none text-center box-border"
          />
        </div>

        <button
          type="button"
          @click="limpiaFormcita"
          class="w-10 h-10 flex items-center justify-center text-lg border border-green-500 rounded-xl bg-green-50 hover:bg-green-200 cursor-pointer transition-colors shrink-0 self-center md:self-auto"
          title="Limpar formulario"
          aria-label="Limpar formulario"
        >
          🧹
        </button>
      </div>

         <!-- Terceira fila: hora, motivo e estado -->
      <div class="flex flex-col md:flex-row gap-2.5 w-full items-stretch md:items-center">
          <div class="flex items-center gap-2 flex-1">
          <label class="ml-1 mr-4 shrink-0 px-2 text-sm font-semibold text-gray-700">Fecha:</label>
          <input
            v-model="novaCita.fecha"
            type="date"
            required
            aria-label="Data da cita"
            class="flex-1 px-3 py-2 text-sm text-center border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>
        <div class="flex items-center gap-1 flex-1 md:flex-initial md:w-50">
          <label class="mr-4 ml-2 shrink-0 text-sm font-semibold text-gray-700">Hora:</label>
          <input
            v-model="novaCita.hora"
            type="time"
            required
            aria-label="Hora da cita"
            class="flex-1 px-3 py-2 text-sm text-center border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>

        <div class="flex-1 md:flex-2">
          <input
            v-model="novaCita.motivo"
            type="text"
            placeholder="Motivo da cita"
            required
            class="w-full ml-4 px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>

        <div class="flex-1 ml-4 md:flex-initial md:w-48">
          <select
            v-model="novaCita.estado"
            required
            aria-label="Estado da cita"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          >
            <option value="pendente">Pendente</option>
            <option value="confirmada">Confirmada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <!-- Cuarta fila: observacións -->
      <div class="w-full">
        <textarea
          v-model="novaCita.observacions"
          placeholder="Diagnóstico - Tratamiento"
          aria-label="Diagnóstico - Tratamiento"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent min-h-[75px] resize-y box-border transition-all"
        ></textarea>
      </div>

      <!-- Gardar ou modificar a cita -->
      <div class="flex justify-center items-center w-full my-1">
        <button
          type="submit"
          class="px-7 py-2 rounded-xl font-medium border-2 border-[#1bb191] bg-[#f0f3f7] hover:bg-[#c8eacf] transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
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
      </div>
    </form>

    <!-- Listaxe de citas -->
    <h4 class="relative text-lg font-semibold bg-[#1ec9a4] text-white py-2 px-4 rounded mb-4 flex items-center justify-center">
      <span>📋 Listaxe de Citas</span>
      <button
        type="button"
        @click="recargarCitas"
        class="absolute right-2 w-8 h-8 flex items-center justify-center text-lg bg-white/20 hover:bg-white/30 rounded cursor-pointer transition-colors"
        title="Recargar citas"
        aria-label="Recargar citas"
      >
        ⟳
      </button>
    </h4>

    <div v-if="citas.length > 0" class="overflow-x-auto w-full">
      <table class="w-full min-w-[750px] border-collapse border border-gray-200 text-xs md:text-sm">
        <thead>
          <tr class="bg-gray-50 text-gray-700">
            <th class="border border-gray-200 p-2.5 text-center font-semibold whitespace-nowrap">ID</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Paciente</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Doctor</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold whitespace-nowrap">Data</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold whitespace-nowrap">Hora</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Motivo</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold whitespace-nowrap">Estado</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold whitespace-nowrap">Accións</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(cita, index) in citas"
            :key="cita._id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="border border-gray-200 p-2.5 text-center">{{ index + 1 }}</td>
            <td class="border border-gray-200 p-2.5 text-left">
              {{ cita.pacienteId?.nomepac }} {{ cita.pacienteId?.apelpac }}
            </td>
            <td class="border border-gray-200 p-2.5 text-left">
              {{ cita.doctorId?.nomedoc }} {{ cita.doctorId?.apeldoc }}
            </td>
            <td class="border border-gray-200 p-2.5 text-center whitespace-nowrap">{{ cita.fecha }}</td>
            <td class="border border-gray-200 p-2.5 text-center whitespace-nowrap">{{ cita.hora }}</td>
            <td class="border border-gray-200 p-2.5 text-left">{{ cita.motivo }}</td>
            <td class="border border-gray-200 p-2.5 text-center whitespace-nowrap capitalize">{{ cita.estado }}</td>
            <td class="border border-gray-200 p-2.5 text-center whitespace-nowrap">
              <button
                type="button"
                title="Editar"
                aria-label="Editar cita"
                class="mr-1.5 px-2 py-1 border border-gray-300 rounded bg-white hover:bg-[#e8f8f3] cursor-pointer transition-colors text-sm"
                @click="editarCita(index)"
              >
                ✏️
              </button>
              <button
                type="button"
                title="Eliminar"
                aria-label="Eliminar cita"
                class="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-red-50 cursor-pointer transition-colors text-sm"
                @click="eliminarCita(index)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-gray-500 text-center py-4">
      Non hai citas cargadas ou falla a conexión coa BBDD.
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { usepacienteStore } from "../store/pacienteStore.js";

import {
  // getCitas,
  saveCita,
  modifyCita,
  deleteCita,
} from "../api/citas.js";

import { getDoctores } from "../api/doctores.js";
import { alertaExito, alertaInfo } from "../utils/alertas.js";

// Variables reactivas
const citas = ref([]);
const doctores = ref([]);
const editando = ref(false);

const pacienteStore = usepacienteStore(); 

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
  observacions: "",
});

onMounted(async () => {
  await cargarDatos();
  console.log("Paciente seleccionado ao montar:", pacienteStore.dnipac);
  novaCita.pacienteId = pacienteStore.dnipac;
});

async function cargarDatos() {
  try {
    doctores.value = await getDoctores();
    // citas.value = await getCitas();
  } catch (error) {
    console.error("Erro ao cargar os datos:", error);
  }
}

function seleccionarDoctor(doctor) {
  doctorSeleccionado.value = doctor;
  novaCita.doctorId = doctor._id;
  mostrarSelectorDoctor.value = false;
}

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

function editarCita(index) {
  const cita = citas.value[index];

  const pacienteId = cita.pacienteId?._id ?? cita.pacienteId;
  const doctorId = cita.doctorId?._id ?? cita.doctorId;

  doctorSeleccionado.value =
    doctores.value.find((d) => d._id === doctorId) ??
    (typeof cita.doctorId === "object" ? cita.doctorId : null);

  Object.assign(novaCita, {
    _id: cita._id,
    pacienteId,
    doctorId,
    fecha: cita.fecha,
    hora: cita.hora,
    motivo: cita.motivo,
    estado: cita.estado,
    observacions: cita.observacions ?? "",
  });

  editando.value = true;
}

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

async function recargarCitas() {
  await cargarDatos();
}

function limpiaFormcita() {
  Object.assign(novaCita, {
    _id: "",
    pacienteId: "",
    doctorId: "",
    fecha: "",
    hora: "",
    motivo: "",
    estado: "pendente",
    observacions: "",
  });

  doctorSeleccionado.value = null;
  mostrarSelectorDoctor.value = false;
  editando.value = false;
}
</script>
