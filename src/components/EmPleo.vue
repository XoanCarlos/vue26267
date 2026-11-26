<template>
  <div class="w-full max-w-3xl mx-auto bg-white p-6 md:p-8 rounded shadow-md box-border text-gray-800 text-left">
    <h4 class="text-lg font-semibold bg-[#1ec9a4] text-white py-2 px-4 rounded mb-4 text-center">
      💼 Traballa con nós — Envío de Currículo
    </h4>

    <p class="text-sm text-gray-600 mb-6 text-center">
      Completa os teus datos e adxunta o teu currículo en formato PDF.
      Gardarase co teu nome e apelidos.
    </p>

    <form
      class="w-full flex flex-col gap-4"
      @submit.prevent="enviarFormulario"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label
            for="empleo-nombre"
            class="text-sm font-semibold text-gray-700"
          >
            Nome *
          </label>
          <input
            id="empleo-nombre"
            v-model.trim="formulario.nombre"
            type="text"
            required
            placeholder="Ex: Ana"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent transition-all"
          >
        </div>

        <div class="flex flex-col gap-1">
          <label
            for="empleo-apellidos"
            class="text-sm font-semibold text-gray-700"
          >
            Apelidos *
          </label>
          <input
            id="empleo-apellidos"
            v-model.trim="formulario.apellidos"
            type="text"
            required
            placeholder="Ex: García López"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent transition-all"
          >
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label
            for="empleo-email"
            class="text-sm font-semibold text-gray-700"
          >
            Correo electrónico *
          </label>
          <input
            id="empleo-email"
            v-model.trim="formulario.email"
            type="email"
            required
            placeholder="correo@exemplo.com"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent transition-all"
          >
        </div>

        <div class="flex flex-col gap-1">
          <label
            for="empleo-telefono"
            class="text-sm font-semibold text-gray-700"
          >
            Teléfono
          </label>
          <input
            id="empleo-telefono"
            v-model.trim="formulario.telefono"
            type="tel"
            placeholder="600 000 000"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent transition-all"
          >
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label
          for="empleo-puesto"
          class="text-sm font-semibold text-gray-700"
        >
          Posto ou área de interese
        </label>
        <input
          id="empleo-puesto"
          v-model.trim="formulario.puesto"
          type="text"
          placeholder="Ex: Enfermaría, Medicina Xeral, Administración..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent transition-all"
        >
      </div>

      <div class="flex flex-col gap-1">
        <label
          for="empleo-observaciones"
          class="text-sm font-semibold text-gray-700"
        >
          Presentación / Observacións
        </label>
        <textarea
          id="empleo-observaciones"
          v-model.trim="formulario.observaciones"
          rows="3"
          placeholder="Cóntanos brevemente a túa experiencia..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent transition-all resize-y"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label
          for="empleo-pdf"
          class="text-sm font-semibold text-gray-700"
        >
          Currículo en PDF * (máx. 5 MB)
        </label>
        <input
          id="empleo-pdf"
          ref="inputArchivo"
          type="file"
          accept="application/pdf,.pdf"
          required
          class="w-full text-sm text-gray-700 border border-dashed border-[#1ca285] rounded-xl p-3 bg-[#f7fcfa] cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1ca285] file:text-white hover:file:bg-[#168c72]"
          @change="seleccionarArchivo"
        >
        <p
          v-if="archivoSeleccionado"
          class="text-xs text-[#168c72] font-medium"
        >
          Archivo seleccionado: {{ archivoSeleccionado.name }}
        </p>
      </div>

      <div class="flex justify-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="enviando"
          class="px-6 py-2 rounded-xl font-semibold text-white bg-[#1ca285] hover:bg-[#168c72] transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
        >
          {{ enviando ? 'Enviando...' : 'Enviar currículo' }}
        </button>

        <button
          type="button"
          :disabled="enviando"
          class="px-5 py-2 rounded-xl font-medium border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
          @click="limpiarFormulario"
        >
          Limpar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { subirCurriculum } from "../api/empleo";
import { alertaError, alertaExito } from "../utils/alertas";

const formulario = reactive({
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  puesto: "",
  observaciones: "",
});

const archivoSeleccionado = ref(null);
const inputArchivo = ref(null);
const enviando = ref(false);

function seleccionarArchivo(event) {
  const file = event.target.files?.[0];
  if (!file) {
    archivoSeleccionado.value = null;
    return;
  }

  const esPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!esPdf) {
    alertaError("O arquivo debe estar en formato PDF.");
    event.target.value = "";
    archivoSeleccionado.value = null;
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alertaError("O arquivo supera o tamaño máximo permitido de 5 MB.");
    event.target.value = "";
    archivoSeleccionado.value = null;
    return;
  }

  archivoSeleccionado.value = file;
}

function limpiarFormulario() {
  formulario.nombre = "";
  formulario.apellidos = "";
  formulario.email = "";
  formulario.telefono = "";
  formulario.puesto = "";
  formulario.observaciones = "";
  archivoSeleccionado.value = null;
  if (inputArchivo.value) {
    inputArchivo.value.value = "";
  }
}

async function enviarFormulario() {
  if (!formulario.nombre || !formulario.apellidos) {
    alertaError("Debes indicar o teu nome e apelidos.");
    return;
  }

  if (!archivoSeleccionado.value) {
    alertaError("Debes adxuntar un arquivo PDF co teu currículo.");
    return;
  }

  enviando.value = true;
  try {
    const respuesta = await subirCurriculum({
      ...formulario,
      archivo: archivoSeleccionado.value,
    });

    await alertaExito(
      `Currículo gardado correctamente como "${respuesta.archivo}".`,
      "Envío completado"
    );
    limpiarFormulario();
  } catch (error) {
    const mensaje =
      error.response?.data?.mensaje ||
      "Non se puido subir o currículo. Comproba que o servidor estea activo.";
    alertaError(mensaje);
  } finally {
    enviando.value = false;
  }
}
</script>
