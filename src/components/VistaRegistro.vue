```vue
<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-[#1ca285] mb-2">
        Crear cuenta
      </h2>

      <p class="text-sm text-gray-500 text-center mb-6">
        Introduce tus datos para registrarte
      </p>

      <!-- Formulario -->
      <form @submit.prevent="registrar">
        <!-- DNI -->
        <div class="mb-4">
          <input
            v-model.trim="dni"
            type="text"
            placeholder="Introduzca su DNI"
            maxlength="9"
            @blur="validarDniNie"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ca285] focus:border-transparent text-center uppercase"
          />
        </div>

        <!-- Contraseña -->
        <div class="mb-4">
          <div class="relative">
            <input
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              placeholder="Introduzca su contraseña"
              required
              minlength="6"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ca285] focus:border-transparent"
            />

            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              @click="mostrarPassword = !mostrarPassword"
            >
              {{ mostrarPassword ? "🙈" : "👁️" }}
            </button>
          </div>
        </div>

        <!-- Repetir contraseña -->
        <div class="mb-5">
          <div class="relative">
            <input
              v-model="repetirPassword"
              :type="mostrarRepetir ? 'text' : 'password'"
              placeholder="Repita su contraseña"
              required
              minlength="6"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1ca285] focus:border-transparent"
            />

            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              @click="mostrarRepetir = !mostrarRepetir"
            >
              {{ mostrarRepetir ? "🙈" : "👁️" }}
            </button>
          </div>

          <p
            v-if="repetirPassword && password !== repetirPassword"
            class="text-red-500 text-xs mt-2"
          >
            Las contraseñas no coinciden.
          </p>
        </div>

        <!-- Mensaje -->
        <p
          v-if="mensaje"
          class="text-center text-sm mb-4"
          :class="error ? 'text-red-500' : 'text-green-600'"
        >
          {{ mensaje }}
        </p>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="!dniValido || password !== repetirPassword || !password"
          class="w-30 py-3 rounded-xl font-semibold text-white bg-[#1ca285] hover:bg-[#168c72] transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Registrarse
        </button>
      </form>

      <!-- Enlace a acceso -->
      <p class="text-center text-sm text-gray-600 mt-6">
        ¿Ya tienes cuenta?

        <RouterLink
          to="/vista-acceso"
          class="text-[#1ca285] font-semibold hover:underline"
        >
          Inicia sesión
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dni = ref("");
const password = ref("");
const repetirPassword = ref("");

const mostrarPassword = ref(false);
const mostrarRepetir = ref(false);

const mensaje = ref("");
const error = ref(false);
const dniValido = ref(false);

function registrar() {
  mensaje.value = "";
  error.value = false;

  if (!validarDniNie()) {
    mensaje.value = "El DNI o NIE no es válido.";
    error.value = true;
    return;
  }

  if (password.value !== repetirPassword.value) {
    mensaje.value = "Las contraseñas no coinciden.";
    error.value = true;
    return;
  }

  if (password.value.length < 6) {
    mensaje.value = "La contraseña debe tener al menos 6 caracteres.";
    error.value = true;
    return;
  }

  console.log({
    dni: dni.value,
    password: password.value,
  });

  mensaje.value = "Datos validados correctamente.";
}

const validarDniNie = (valor) => {

  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  valor = dni.value.trim().toUpperCase();
  dni.value = valor;

  dniValido.value = false;

  if (dniRegex.test(valor)) {
    const numero = parseInt(valor.slice(0, 8), 10);
    const letra = valor.charAt(8);

    dniValido.value = letra === letras[numero % 23];

  } else if (nieRegex.test(valor)) {
    const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2");
    const numero = parseInt(nie.slice(0, 8), 10);
    const letra = valor.charAt(8);

    dniValido.value = letra === letras[numero % 23];
  }

  return dniValido.value;
};
</script>
