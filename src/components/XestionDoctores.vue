<template>
  <div class="w-full bg-white p-4 rounded shadow-md box-border text-gray-800">
    <h4 class="text-lg font-semibold bg-[#1ec9a4] text-white py-2 px-4 rounded mb-4 text-center">
      👨‍⚕️ Xestión de Doctores 👩‍⚕️
    </h4>

    <form @submit.prevent="guardarDoctor" class="w-full flex flex-col gap-3.5 mb-6">
      <!-- Fila 1 -->
      <div class="flex flex-col md:flex-row gap-2.5 w-full items-stretch md:items-center">
        <div class="flex items-center gap-1 md:flex-1">
          <label class="w-20 shrink-0 text-sm font-semibold text-gray-700">ID :</label>
          <input
            v-model="novoDoctor._id"
            type="text"
            disabled
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed box-border"
          />
        </div>

        <button
          type="button"
          @click="limpiaFormdoc"
          class="w-9 h-9 flex items-center justify-center text-lg border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors shrink-0 self-center md:self-auto"
          title="Limpar formulario"
        >
          🧹
        </button>

        <div class="flex items-center gap-1 md:flex-2">
          <label for="nome" class="min-w-[60px] text-sm font-semibold text-gray-700">Nome:</label>
          <input
            id="nome"
            v-model="novoDoctor.nomedoc"
            type="text"
            required
            @blur="capitalizarTexto('nomedoc')"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>

        <div class="flex items-center gap-1 md:flex-2">
          <label for="apellido" class="min-w-[60px] text-sm font-semibold text-gray-700">Apellidos:</label>
          <input
            id="apellido"
            v-model="novoDoctor.apeldoc"
            type="text"
            required
            @blur="capitalizarTexto('apeldoc')"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>

        <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 shrink-0">
          <span>Colegiado:</span>
          <label class="flex items-center gap-1 cursor-pointer font-normal">
            <input type="radio" value="true" v-model="novoDoctor.coledoc" class="accent-[#1ca285] cursor-pointer" />
            Si
          </label>
          <label class="flex items-center gap-1 cursor-pointer font-normal">
            <input type="radio" value="false" v-model="novoDoctor.coledoc" class="accent-[#1ca285] cursor-pointer" />
            No
          </label>
        </div>
      </div>

      <!-- Fila 2 -->
      <div class="flex flex-col md:flex-row gap-2.5 w-full items-stretch md:items-center">
        <div class="flex items-center gap-1 md:flex-2">
          <label class="w-20 shrink-0 text-sm font-semibold text-gray-700">Correo:</label>
          <input
            v-model="novoDoctor.maildoc"
            type="email"
            :class="[
              'flex-1 px-3 py-2 text-sm border rounded-xl focus:outline-none box-border transition-all',
              !correoValido
                ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                : 'border-gray-300 focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent'
            ]"
            @blur="validarcorreo"
          />
        </div>

        <div class="flex items-center gap-1 md:flex-1">
          <label class="min-w-[60px] text-sm font-semibold text-gray-700">Móvil:</label>
          <input
            v-model="novoDoctor.movildoc"
            type="text"
            required
            @blur="validarMovil"
            :class="[
              'flex-1 px-3 py-2 text-sm text-center border rounded-xl focus:outline-none box-border transition-all',
              !movilValido
                ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                : 'border-gray-300 focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent'
            ]"
          />
        </div>

        <div class="flex items-center gap-1 md:flex-2">
          <label for="especialidad" class="min-w-[60px] text-sm font-semibold text-gray-700">Especialidad:</label>
          <select
            id="especialidad"
            v-model="novoDoctor.espedoc"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          >
            <option value="">Selecciona una Especialidad</option>
            <option
              v-for="especialidad in especialidades"
              :key="especialidad.id"
              :value="especialidad.nm"
            >
              {{ especialidad.nm }}
            </option>
          </select>
        </div>

        <button
          type="button"
          @click="buscarDoctoresPorEspecialidad(novoDoctor.espedoc)"
          class="w-9 h-9 flex items-center justify-center text-lg border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors shrink-0 self-center md:self-auto"
          title="Buscar por especialidad"
        >
          🔍
        </button>
      </div>

      <!-- Fila de Botóns -->
      <div class="flex justify-center items-center gap-2.5 w-full my-1">
        <button
          type="submit"
          class="px-6 py-1.5 rounded-xl font-medium border-2 border-[#1bb191] bg-[#f0f3f7] hover:bg-[#c8eacf] transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="
            novoDoctor.nomedoc === '' ||
            novoDoctor.apeldoc === '' ||
            novoDoctor.movildoc === '' ||
            novoDoctor.espedoc === ''
          "
        >
          Gardar
        </button>

        <button
          type="button"
          @click="exportarDoctores"
          :disabled="doctores.length === 0"
          class="w-9 h-9 p-1 flex items-center justify-center border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Exportar a PDF"
        >
          <img
            src="../assets/img/impresora.png"
            class="w-6 h-6 object-contain"
            alt="Imprimir"
          />
        </button>

        <button
          type="button"
          @click="recargarDoctores()"
          class="w-9 h-9 p-1 flex items-center justify-center border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
          title="Recargar listado"
        >
          <img
            src="../assets/img/recargar.png"
            class="w-6 h-6 object-contain"
            alt="Recargar"
          />
        </button>
      </div>
    </form>

    <h4 class="text-lg font-semibold bg-[#1ec9a4] text-white py-2 px-4 rounded mb-4 text-center">
      📋 Listaxe de Doctores
    </h4>

    <div v-if="doctores.length > 0" class="overflow-x-auto w-full">
      <table class="w-full border-collapse border border-gray-200 text-xs md:text-sm">
        <thead>
          <tr class="bg-gray-50 text-gray-700">
            <th class="border border-gray-200 p-2.5 text-center font-semibold">ID</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold whitespace-nowrap">Código</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Apelidos</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Nome</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Movil</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Especialidad</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Accións</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(u, index) in doctores"
            :key="index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="border border-gray-200 p-2.5 text-center">{{ index + 1 }}</td>
            <td class="border border-gray-200 p-2.5 text-center whitespace-nowrap text-xs text-gray-500 font-mono">
              {{ u._id }}
            </td>
            <td class="border border-gray-200 p-2.5 text-left">{{ u.apeldoc }}</td>
            <td class="border border-gray-200 p-2.5 text-left">{{ u.nomedoc }}</td>
            <td class="border border-gray-200 p-2.5 text-center">{{ u.movildoc }}</td>
            <td class="border border-gray-200 p-2.5 text-center">{{ u.espedoc }}</td>
            <td class="border border-gray-200 p-2.5 text-center whitespace-nowrap">
              <button
                class="mr-1.5 px-2 py-1 border border-gray-300 rounded bg-white hover:bg-[#e8f8f3] cursor-pointer transition-colors text-sm"
                title="Editar"
                @click="editarDoctor(index)"
              >
                ✏️
              </button>
              <button
                class="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-red-50 cursor-pointer transition-colors text-sm"
                title="Eliminar"
                @click="eliminarDoctor(index)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-gray-500 text-center py-4">
      Non hai doctores cargados ou falla conexión BBDD.
    </p>
  </div>
</template>

<script setup>
// Importación de funciones y hooks de Vue
import { ref, reactive, onMounted } from "vue";
import { obtenerEspecialidades } from "../api/especialidades.js";
import {
  getDoctores,
  saveDoctor,
  getDoctorByEspecialidad,
  deleteDoctor,
  modifyDoctor,
} from "../api/doctores.js";
import { alertaExito, alertaInfo } from "../utils/alertas.js";
import { generarPDF } from "../utils/pdf.js";

// Definición de variables reactivas
const doctores = ref([]);
const especialidades = ref([]);
const editando = ref(false);

const novoDoctor = reactive({
  nomedoc: "",
  apeldoc: "",
  maildoc: "",
  movildoc: "",
  coledoc: "",
  espedoc: "",
});

onMounted(async () => {
  doctores.value = await getDoctores();
  especialidades.value = await obtenerEspecialidades();
});

// ========== FUNCIONES PRINCIPALES BBDD ============
async function guardarDoctor() {
  try {
    if (editando.value) {
      const doctorModificado = await modifyDoctor(novoDoctor._id, novoDoctor);
      const index = doctores.value.findIndex((p) => p._id === novoDoctor._id);

      if (index !== -1) {
        doctores.value[index] = doctorModificado;
      }
      alertaExito("Datos Doctor modificados");
    } else {
      await saveDoctor(novoDoctor);
      alertaExito("Datos doctor guardados");
    }

    editando.value = false;
  } catch (error) {
    console.error("Error ao gardar doctor:", error);
  }
  limpiaFormdoc();
  doctores.value = await getDoctores();
}

function editarDoctor(index) {
  const doctor = doctores.value[index];
  Object.assign(novoDoctor, doctor);
  editando.value = true;
}

async function eliminarDoctor(index) {
  const doctor = doctores.value[index];
  try {
    await deleteDoctor(doctor._id);
    doctores.value.splice(index, 1);
    alertaInfo("Datos doctor eliminados");
  } catch (error) {
    console.error("Error ao eliminar doctor:", error);
  }
}

async function buscarDoctoresPorEspecialidad(especialidad) {
  try {
    if (!especialidad) {
      doctores.value = await getDoctores();
      return;
    }
    doctores.value = await getDoctorByEspecialidad(especialidad);
  } catch (error) {
    console.error("Error ao buscar doctores por especialidad:", error);
  }
}

async function recargarDoctores() {
  try {
    doctores.value = await getDoctores();
  } catch (error) {
    console.error("Error ao recargar doctores:", error);
  }
}

/// ========== FUNCIONES AUXILIARES ============
const capitalizarTexto = (campo) => {
  const texto = novoDoctor[campo] ?? "";
  novoDoctor[campo] = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

const correoValido = ref(true);

const validarcorreo = () => {
  const correo = novoDoctor.maildoc.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(correo)) {
    correoValido.value = false;
    novoDoctor.maildoc = "";
  } else {
    correoValido.value = true;
  }
};

const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;
const validarMovil = () => {
  const movil = novoDoctor.movildoc.trim();

  if (movil === "") {
    movilValido.value = true;
    return true;
  }

  if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
    movilValido.value = movilRegex.test(movil);
    return movilValido.value;
  } else {
    movilValido.value = false;
    novoDoctor.movildoc = "";
    return false;
  }
};

const limpiaFormdoc = () => {
  Object.keys(novoDoctor).forEach((key) => {
    if (typeof novoDoctor[key] === "boolean") {
      novoDoctor[key] = false;
    } else {
      novoDoctor[key] = "";
    }
  });
  editando.value = false;
  correoValido.value = true;
  movilValido.value = true;
};

const exportarDoctores = () => {
  generarPDF(
    "Listado de doctores",
    ["ID", "Apellidos", "Nombre", "Móvil", "Especialidad"],
    doctores.value.map((d) => [
      d._id,
      d.apeldoc,
      d.nomedoc,
      d.movildoc,
      d.espedoc,
    ]),
    "listado_doctores.pdf",
  );
};
</script>
