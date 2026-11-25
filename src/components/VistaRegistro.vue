```vue
<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-[#1ca285] mb-2">
        Crear cuenta
      </h2>


      <!-- Formulario -->
      <form @submit.prevent="registrar">
        <!-- DNI -->
        <div class="mb-4">
          <input
            v-model.trim="dni"
            type="text"
            placeholder="Introduzca su DNI"
            :maxlength="errorDni ? 35 : 9"
            @blur="validarDniNie"
            @focus="if (errorDni) { dni = ''; errorDni = false; }"
            required
            class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-center uppercase transition-colors"
            :class="errorDni ? 'border-red-400 text-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-[#1ca285] focus:border-transparent'"
          />
        </div>

        <!-- Correo electrónico -->
        <div class="mb-4">
          <input
            v-model.trim="email"
            type="email"
            placeholder="Introduzca su correo electrónico"
            @blur="validarEmail"
            @focus="if (errorEmail) { email = ''; errorEmail = false; }"
            required
            class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-center transition-colors"
            :class="errorEmail ? 'border-red-400 text-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-[#1ca285] focus:border-transparent'"
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
const email = ref("");
const password = ref("");
const repetirPassword = ref("");

const mostrarPassword = ref(false);
const mostrarRepetir = ref(false);

const mensaje = ref("");
const error = ref(false);
const dniValido = ref(false);
const errorDni = ref(false);
const errorEmail = ref(false);

function registrar() {
  mensaje.value = "";
  error.value = false;

  if (!validarDniNie()) {
    return;
  }

  if (!validarEmail()) {
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

  mensaje.value = "Datos validados correctamente.";
}

const validarEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value || !emailRegex.test(email.value)) {
    errorEmail.value = true;
    mensaje.value = "El correo electrónico no es válido.";
    error.value = true;
    return false;
  } else {
    errorEmail.value = false;
    mensaje.value = "";
    error.value = false;
    return true;
  }
};

const validarDniNie = () => {
  const valor = dni.value.trim().toUpperCase();

  if (!valor || valor === "EL DNI O NIE NO ES VÁLIDO.") {
    dniValido.value = false;
    errorDni.value = false;
    return false;
  }

  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  let valido = false;
  if (dniRegex.test(valor)) {
    const numero = parseInt(valor.slice(0, 8), 10);
    const letra = valor.charAt(8);
    valido = letra === letras[numero % 23];
  } else if (nieRegex.test(valor)) {
    const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2");
    const numero = parseInt(nie.slice(0, 8), 10);
    const letra = valor.charAt(8);
    valido = letra === letras[numero % 23];
  }

  dniValido.value = valido;

  if (!valido) {
    errorDni.value = true;
    dni.value = "El DNI o NIE no es válido.";
  } else {
    errorDni.value = false;
    dni.value = valor;
  }

  return valido;
};
</script>
