<template>
  <div class="w-full bg-white p-4 rounded shadow-md box-border text-gray-800">
    <h4 class="text-lg font-semibold bg-[#1ec9a4] text-white py-2 px-4 rounded mb-4 text-center">
      👥 Xestión de Pacientes
    </h4>

    <form @submit.prevent="guardarPaciente" class="w-full flex flex-col gap-3.5 mb-6">
      <!-- Fila 1 -->
      <div class="flex flex-col md:flex-row gap-2.5 w-full items-stretch md:items-center">
        <div class="flex items-center gap-1 md:flex-1">
          <label class="w-28 shrink-0 text-sm font-semibold text-gray-700">DNI/CIF:</label>
          <input
            v-model="novoPaciente.dnipac"
            type="text"
            required
            @blur="validarDni"
            :class="[
              'flex-1 px-3 py-2 text-sm text-center border rounded-xl focus:outline-none box-border transition-all',
              !dniValido
                ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                : 'border-gray-300 focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent'
            ]"
          />
        </div>

        <button
          type="button"
          @click="buscarPaciente"
          class="w-9 h-9 flex items-center justify-center text-lg border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors shrink-0 self-center md:self-auto"
          title="Buscar paciente"
        >
          🔎
        </button>

        <button
          type="button"
          @click="limpiaFormpac"
          class="w-9 h-9 flex items-center justify-center text-lg border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors shrink-0 self-center md:self-auto"
          title="Limpar formulario"
        >
          🧹
        </button>

        <div v-if="!dniValido" class="text-xs text-red-500 font-medium md:self-center">
          DNI o NIE inválido.
        </div>

        <div class="flex items-center gap-1 md:flex-4">
          <label for="nome" class="min-w-[60px] text-sm font-semibold text-gray-700">Nome:</label>
          <input
            id="nome"
            v-model="novoPaciente.nomepac"
            type="text"
            required
            @blur="capitalizarTexto('nomepac')"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>

        <div class="flex items-center gap-1 md:flex-4">
          <label for="apellido" class="min-w-[60px] text-sm font-semibold text-gray-700">Apellidos:</label>
          <input
            id="apellido"
            v-model="novoPaciente.apelpac"
            type="text"
            required
            @blur="capitalizarTexto('apelpac')"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>
      </div>

      <!-- Fila 2 -->
      <div class="flex flex-col md:flex-row gap-2.5 w-full items-stretch md:items-center">
        <div class="flex items-center gap-1 md:flex-1">
          <label class="w-28 shrink-0 text-sm font-semibold text-gray-700">Fecha Nac.:</label>
          <input
            v-model="novoPaciente.nacipac"
            type="date"
            placeholder="dd/mm/yyyy"
            required
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>

        <div class="flex items-center gap-1 md:flex-2">
          <label class="min-w-[60px] text-sm font-semibold text-gray-700">Correo:</label>
          <input
            v-model="novoPaciente.mailpac"
            type="email"
            @blur="validarcorreo"
            :class="[
              'flex-1 px-3 py-2 text-sm border rounded-xl focus:outline-none box-border transition-all',
              !correoValido
                ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                : 'border-gray-300 focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent'
            ]"
          />
        </div>

        <div class="flex items-center gap-1 md:flex-1">
          <label class="min-w-[60px] text-sm font-semibold text-gray-700">Móvil:</label>
          <input
            v-model="novoPaciente.movilpac"
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
      </div>

      <!-- Fila 3 -->
      <div class="flex flex-col md:flex-row gap-2.5 w-full items-stretch md:items-center">
        <div class="flex items-center gap-1 md:flex-4">
          <label class="w-28 shrink-0 text-sm font-semibold text-gray-700">Dirección:</label>
          <input
            v-model="novoPaciente.dirpac"
            type="text"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          />
        </div>

        <div class="flex items-center gap-1 md:flex-3">
          <label for="provincia" class="min-w-[60px] text-sm font-semibold text-gray-700">Provincia:</label>
          <select
            id="provincia"
            v-model="novoPaciente.propac"
            @change="cargarMunicipios"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          >
            <option value="">Selecciona una provincia</option>
            <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.nm">
              {{ provincia.nm }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-1 md:flex-3">
          <label for="municipio" class="min-w-[60px] text-sm font-semibold text-gray-700">Municipio:</label>
          <select
            id="municipio"
            v-model="novoPaciente.munipac"
            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          >
            <option value="">Selecciona un municipio</option>
            <option v-for="municipio in municipios" :key="municipio.id" :value="municipio.nm">
              {{ municipio.nm }}
            </option>
          </select>
        </div>
      </div>

      <!-- Checkbox LOPD -->
      <div class="flex items-center justify-center my-1 text-sm text-gray-700">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            v-model="novoPaciente.lopdpac"
            type="checkbox"
            class="w-4 h-4 rounded accent-[#1ca285] cursor-pointer"
          />
          <span>
            Aceptar a
            <a
              :href="$router.resolve({ name: 'PoliticaPrivacidad' }).href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[#1ca285] hover:underline font-medium"
            >
              política de privacidad e confidencialidade.
            </a>
          </span>
        </label>
      </div>

      <!-- Fila de Botóns -->
      <div class="flex justify-center items-center gap-2.5 w-full my-1">
        <button
          type="submit"
          class="px-6 py-1.5 rounded-xl font-medium border-2 border-[#1bb191] bg-[#f0f3f7] hover:bg-[#c8eacf] transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="
            novoPaciente.dnipac === '' ||
            novoPaciente.nomepac === '' ||
            novoPaciente.apelpac === '' ||
            !novoPaciente.lopdpac
          "
        >
          Gardar
        </button>

        <button
          type="button"
          class="px-6 py-1.5 rounded-xl font-medium border-2 border-[#1bb191] bg-[#f0f3f7] hover:bg-red-100 transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
          @click="eliminarPaciente(novoPaciente.dnipac)"
          :disabled="
            novoPaciente.dnipac === '' ||
            novoPaciente.nomepac === '' ||
            novoPaciente.apelpac === '' ||
            !novoPaciente.lopdpac
          "
        >
          Eliminar
        </button>

        <button
          type="button"
          title="Imprimir Listado Pacientes"
          class="w-9 h-9 p-1 flex items-center justify-center border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          @click="exportarPacientes"
          :disabled="pacientes.length === 0"
        >
          <img
            src="../assets/img/impresora.png"
            class="w-6 h-6 object-contain"
            alt="Imprimir"
          />
        </button>
      </div>
    </form>

    <h4 class="text-lg font-semibold bg-[#1ec9a4] text-white py-2 px-4 rounded mb-4 text-center">
      📋 Listaxe de Pacientes
    </h4>

    <div v-if="pacientes.length > 0" class="overflow-x-auto w-full">
      <table class="w-full border-collapse border border-gray-200 text-xs md:text-sm">
        <thead>
          <tr class="bg-gray-50 text-gray-700">
            <th class="border border-gray-200 p-2.5 text-center font-semibold">ID</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold whitespace-nowrap">DNI/CIF</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Apelidos</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Nome</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Correo</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Provincia</th>
            <th class="border border-gray-200 p-2.5 text-center font-semibold">Accións</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(u, index) in pacientes"
            :key="index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="border border-gray-200 p-2.5 text-center">{{ index + 1 }}</td>
            <td class="border border-gray-200 p-2.5 text-center font-mono">{{ u.dnipac }}</td>
            <td class="border border-gray-200 p-2.5 text-left">{{ u.apelpac }}</td>
            <td class="border border-gray-200 p-2.5 text-left">{{ u.nomepac }}</td>
            <td class="border border-gray-200 p-2.5 text-left">{{ u.mailpac }}</td>
            <td class="border border-gray-200 p-2.5 text-center">{{ u.propac }}</td>
            <td class="border border-gray-200 p-2.5 text-center whitespace-nowrap">
              <button
                class="mr-1.5 px-2 py-1 border border-gray-300 rounded bg-white hover:bg-[#e8f8f3] cursor-pointer transition-colors text-sm"
                title="Editar"
                @click="editarPaciente(index)"
              >
                ✏️
              </button>
              <button
                class="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-red-50 cursor-pointer transition-colors text-sm"
                title="Eliminar"
                @click="eliminarPaciente(index)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-gray-500 text-center py-4">
      Non hai pacientes cargados.
    </p>
  </div>
</template>

<script setup>
/// Zona de importaciones
import { ref, reactive, onMounted } from "vue";
import { obtenerMunicipios, obtenerProvincias } from "../api/municipios.js";
import { usepacienteStore } from "../store/pacienteStore.js";
import {
  getPacientes,
  savePaciente,
  deletePaciente,
  modifyPaciente,
  getPacienteByDni,
} from "../api/pacientes.js";

import {
  alertaExito,
  alertaError,
  alertaConfirmacion,
} from "../utils/alertas.js";

import { generarPDF } from "../utils/pdf.js";

// Zona de variables reactivas y referencias
const provincias = ref([]);
const municipios = ref([]);

const pacientes = ref([]);
const editando = ref(false);

const novoPaciente = reactive({
  dnipac: "",
  nomepac: "",
  apelpac: "",
  nacipac: "",
  mailpac: "",
  movilpac: "",
  dirpac: "",
  propac: "",
  munipac: "",
  lopdpac: false,
});

onMounted(async () => {
  provincias.value = await obtenerProvincias();
  pacientes.value = await getPacientes();
});

function seleccionarPaciente(paciente) {
  const pacienteStore = usepacienteStore();
  pacienteStore.seleccionarPaciente(paciente);

}

/// Zona de métodos ou funcións bbdd
async function cargarMunicipios() {
  if (novoPaciente.propac === "") {
    municipios.value = [];
    return;
  }

  const provincia = provincias.value.find((p) => p.nm === novoPaciente.propac);
  if (provincia) {
    municipios.value = await obtenerMunicipios(provincia.id);
  }
}

async function guardarPaciente() {
  try {
    if (editando.value) {
      const respuesta = await alertaConfirmacion("Esta seguro modificar paciente?");
      if (respuesta.isConfirmed) {
        const pacienteModificado = await modifyPaciente(
          novoPaciente.dnipac,
          novoPaciente,
        );

        const index = pacientes.value.findIndex(
          (p) => p.dnipac === novoPaciente.dnipac,
        );
        if (index !== -1) {
          pacientes.value[index] = pacienteModificado;
        }
        alertaExito("El paciente modificado correctamente");
      } else {
        return;
      }
    } else {
      const respuesta = await alertaConfirmacion("Esta seguro crear paciente?");
      if (respuesta.isConfirmed) {
        await savePaciente(novoPaciente);
        alertaExito("El paciente se ha guardado correctamente");
      } else {
        return;
      }
      editando.value = false;
      getPacientes();
      pacienteStore.seleccionarPaciente(novoPaciente);
    }
  } catch (error) {
    alertaError(
      "Error al guardar el paciente. Contacte con el administrador",
      error,
    );
  }
  pacientes.value = await getPacientes();
}

async function eliminarPaciente(indexOrDni) {
  try {
    const confirmacion = await alertaConfirmacion(
      "¿Estás seguro eliminar el paciente?",
    );
    if (!confirmacion.isConfirmed) {
      return;
    }

    const dni = typeof indexOrDni === "number" ? pacientes.value[indexOrDni]?.dnipac : indexOrDni;
    if (!dni) return;

    await deletePaciente(dni);

    if (typeof indexOrDni === "number") {
      pacientes.value.splice(indexOrDni, 1);
    }
    limpiaFormpac();
    pacientes.value = await getPacientes();
    alertaExito("El paciente se ha eliminado correctamente");
  } catch (error) {
    console.error("Error ao eliminar paciente:", error);
  }
}

function editarPaciente(index) {
  const paciente = pacientes.value[index];
  Object.assign(novoPaciente, paciente);
  editando.value = true;
  // usamos el store 
  seleccionarPaciente(paciente);



  cargarMunicipios();
}

async function buscarPaciente() {
  try {
    const dni = novoPaciente.dnipac.trim();

    if (!dni) {
      console.log("Introduce un DNI");
      return;
    }

    const paciente = await getPacienteByDni(dni);

    Object.assign(novoPaciente, paciente);
    // usamos el store
    seleccionarPaciente(paciente);

    await cargarMunicipios();
    editando.value = true;
    console.log("Paciente encontrado:", paciente);
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("Paciente no encontrado");
    } else {
      console.error("Error al buscar paciente:", error);
    }
  }
}

// ============== FUNCIONES AUXILIARES =====================
const limpiaFormpac = () => {
  Object.keys(novoPaciente).forEach((key) => {
    if (typeof novoPaciente[key] === "boolean") {
      novoPaciente[key] = false;
    } else {
      novoPaciente[key] = "";
    }
  });
  editando.value = false;
  dniValido.value = true;
  correoValido.value = true;
  movilValido.value = true;
};

const dniValido = ref(true);

const validarDniNie = (valor) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  valor = valor.toUpperCase();

  if (dniRegex.test(valor)) {
    const numero = parseInt(valor.slice(0, 8), 10);
    const letra = valor.charAt(8);
    return letra === letras[numero % 23];
  } else if (nieRegex.test(valor)) {
    const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2");
    const numero = parseInt(nie.slice(0, 8), 10);
    const letra = valor.charAt(8);
    return letra === letras[numero % 23];
  }
  novoPaciente.dnipac = "";
  return false;
};

const validarDni = () => {
  novoPaciente.dnipac = novoPaciente.dnipac.trim().toUpperCase();
  dniValido.value = validarDniNie(novoPaciente.dnipac);
};

const capitalizarTexto = (campo) => {
  const texto = novoPaciente[campo] ?? "";
  novoPaciente[campo] = texto
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
  const correo = novoPaciente.mailpac.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(correo)) {
    correoValido.value = false;
    novoPaciente.mailpac = "";
  } else {
    correoValido.value = true;
  }
};

const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;
const validarMovil = () => {
  const movil = novoPaciente.movilpac.trim();

  if (movil === "") {
    movilValido.value = true;
    return true;
  }

  if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
    movilValido.value = movilRegex.test(movil);
    return movilValido.value;
  } else {
    movilValido.value = false;
    novoPaciente.movilpac = "";
    return false;
  }
};

const exportarPacientes = () => {
  generarPDF(
    "Listado de pacientes",
    ["DNI", "Apellidos", "Nombre", "Móvil"],
    pacientes.value.map((p) => [p.dnipac, p.apelpac, p.nomepac, p.movilpac]),
    "listado_pacientes.pdf",
  );
};
</script>
