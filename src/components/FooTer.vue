<template>
  <footer
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-[95vw] md:w-[80vw] max-w-[95vw] md:max-w-[80vw] h-[40px] z-50 bg-[#1ca285] text-white text-xs md:text-sm flex items-center justify-center gap-6 md:gap-20 px-4 md:px-12 box-border shadow-inner"
  >
    <ul class="list-none p-0 m-0 flex items-center gap-4 md:gap-8">
      <li>
        <router-link
          to="/avisolegal"
          class="text-white hover:text-[#ffe66d] transition-colors underline-offset-2 hover:underline font-medium"
        >
          Aviso Legal
        </router-link>
      </li>
      <li>
        <router-link
          to="/empleo"
          class="text-white hover:text-[#ffe66d] transition-colors underline-offset-2 hover:underline font-medium"
        >
          Empleo
        </router-link>
      </li>
    </ul>
    <p class="m-0 whitespace-nowrap">
      © {{ new Date().getFullYear() }} Sanidad Teis — Desenvolvido en Vue 3
    </p>
  </footer>
</template>

<script setup></script>
