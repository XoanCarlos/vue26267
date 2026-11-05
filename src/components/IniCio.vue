<template>
  <div class="w-full bg-white p-6 rounded shadow-md text-left">
    <h2 class="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">
    <p class="text-gray-500 mb-6 text-center">Benvido ao sistema de Xestión Sanitaria de Sanidad Teis.</p>
</h2>
    <!-- Contenedor flex para centrar el video -->
    <div class="flex justify-center items-center w-full my-4">
      <video
        ref="videoRef"
        src="../assets/img/inicio.mp4 "
        autoplay
        muted
        loop
        playsinline
        class="w-full max-w-5xl rounded-xl shadow-inner object-cover aspect-video"
      >
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Referencia al elemento de video
const videoRef = ref(null)

onMounted(() => {
  if (videoRef.value) {
    // 0.5 reduce la velocidad a la mitad. Puedes probar con 0.3 o 0.7 según gustos.
    videoRef.value.playbackRate = 0.8 
  }
})
</script>
