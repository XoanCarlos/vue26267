<template>
  <nav class="fixed top-0 left-1/2 -translate-x-1/2 w-[95vw] md:w-[80vw] max-w-[95vw] md:max-w-[80vw] h-[50px] z-50 bg-[#1ca285] text-white flex items-center px-4 md:px-12 relative box-border shadow-sm">
    <div class="flex items-center font-bold text-base z-10 select-none">
      <img :src="logo" alt="Sanidad Teis" class="w-[30px] h-[30px] mr-2 object-contain" />
      <span>Sanidad Teis</span>
    </div>

    <!-- Botón Hamburguesa -->
    <button
      class="md:hidden p-1 px-2.5 rounded bg-[#1ca285] hover:bg-[#188e74] text-white text-2xl cursor-pointer absolute right-4 z-10 border-0 leading-none transition-colors"
      @click="isOpen = !isOpen"
      aria-label="Abrir menú"
    >
      ☰
    </button>

    <!-- Menú de navegación -->
    <ul
      :class="[
        'list-none m-0 p-0 md:flex md:flex-row md:items-center md:gap-8 md:absolute md:left-1/2 md:-translate-x-1/2',
        isOpen
          ? 'flex flex-col absolute top-full left-0 right-0 w-full bg-[#1ca285] px-8 py-4 gap-4 z-50 shadow-lg'
          : 'hidden'
      ]"
    >
      <li>
        <RouterLink
          to="/"
          class="text-white no-underline font-medium whitespace-nowrap hover:text-[#ffe66d] transition-colors py-1 inline-block"
          active-class="border-b-2 border-[#ffe66d]"
          @click="isOpen = false"
        >
          Inicio
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/xestion-pacientes"
          class="text-white no-underline font-medium whitespace-nowrap hover:text-[#ffe66d] transition-colors py-1 inline-block"
          active-class="border-b-2 border-[#ffe66d]"
          @click="isOpen = false"
        >
          Pacientes
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/xestion-doctores"
          class="text-white no-underline font-medium whitespace-nowrap hover:text-[#ffe66d] transition-colors py-1 inline-block"
          active-class="border-b-2 border-[#ffe66d]"
          @click="isOpen = false"
        >
          Doctores
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/xestion-citas"
          class="text-white no-underline font-medium whitespace-nowrap hover:text-[#ffe66d] transition-colors py-1 inline-block"
          active-class="border-b-2 border-[#ffe66d]"
          @click="isOpen = false"
        >
          Citas
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/sobrenos"
          class="text-white no-underline font-medium whitespace-nowrap hover:text-[#ffe66d] transition-colors py-1 inline-block"
          active-class="border-b-2 border-[#ffe66d]"
          @click="isOpen = false"
        >
          Sobre nós
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue"
import logo from "../assets/img/favicon2.png"

const isOpen = ref(false)
</script>
