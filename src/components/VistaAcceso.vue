<template>
  <div class="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md box-border text-gray-800 my-10">
    <h2 class="text-xl font-bold text-center text-[#1ca285] mb-2">
      🔐 Acceso ao Sistema - Sanidad Teis 🩺
    </h2>
    <br>

    <!-- Formulario de Acceso -->
    <form
      class="w-full flex flex-col gap-4"
      @submit.prevent="handleLogin"
    >
      <!-- Campo Usuario -->
      <div class="flex flex-col gap-1">
        <input
          id="usuario"
          v-model="usuario"
          type="text"
          placeholder="Introduce o teu DNI"
          required
          aria-label="Usuario"
          class="w-full text-center px-3 py-4 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
        >
      </div>

      <!-- Campo Contrasinal co botón de mostrar/ocultar -->
      <div class="flex flex-col gap-1">
    
        <div class="relative flex items-center">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Introduce o contrasinal"
            required
            aria-label="Contrasinal"
            class="w-full px-3 py-4 pr-16 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1ec9a4] focus:border-transparent box-border transition-all"
          >
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-2 px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer transition-colors"
            aria-label="Alternar visibilidade do contrasinal"
          >
            {{ showPassword ? "🙈" : "👁️"  }}
          </button>
        </div>
      </div>

      <!-- Botón de Enviar / Entrar -->
      <div class="flex justify-center items-center w-full mt-4">
        <button
          type="submit"
          class="w-50 py-2.5 rounded-xl font-medium border-2 border-[#1bb191] bg-[#f0f3f7] hover:bg-[#c8eacf] transition-colors cursor-pointer text-gray-800 shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="usuario.trim() === '' || password.trim() === ''"
        >
          Acceder
        </button>
      </div>
      <div> 
         <p class="text-center text-sm text-gray-600 mt-6">
        ¿Olvidas tu contraseña? 
        <RouterLink
          to="/#"
          class="text-[#1ca285] font-semibold hover:underline"
        >
          Recuperar contraseña
        </RouterLink>
      </p>
      </div>
      <div>
         <hr>      
         <p class="text-center text-sm text-gray-600 mt-6">
        ¿No tienes cuenta? 
        <RouterLink
          to="/vista-registro"
          class="text-[#1ca285] font-semibold hover:underline"
        >
          Regístrate
        </RouterLink>
      </p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'VistaAcceso',
  data() {
    return {
      usuario: '',
      password: '',
      showPassword: false
    };
  },
  methods: {
    handleLogin() {
      // Lógica de validación ou redirección do acceso
      console.log('Iniciando sesión con o usuario:', this.usuario);
    }
  }
};
</script>