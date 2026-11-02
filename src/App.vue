<template>
  <div id="app">
    <NavBar />
    <main class="contenido">
      <router-view /> <!-- Aquí se carga el router -->    
    </main>
    <FooTer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooTer from './components/FooTer.vue'
</script>

<style>
/* NAVBAR FIJA ARRIBA */
nav, .navbar {
  position: fixed !important;
  top: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 80vw !important;
  max-width: 80vw !important;
  z-index: 1000;
  box-sizing: border-box !important;
}

/* FOOTER FIJO ABAJO (Aplicando la misma lógica exacta) */
footer, .footer, .footer-content {
  position: fixed !important;
  bottom: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 80vw !important;
  max-width: 80vw !important;
  height: 40px !important; /* Definimos un alto fijo claro */
  z-index: 1000;
  box-sizing: border-box !important;
  margin: 0 !important; /* Eliminamos cualquier margen que lo encoja */
}

/* CONTENIDO CENTRAL */
.contenido {
  padding-top: 10vh;
  padding-bottom: 60px; /* Margen inferior para que el contenido no se oculte tras el footer */
}

/* PANTALLAS PEQUEÑAS (Móviles) */
@media (max-width: 768px) {
  #app {
    max-width: 95vw;
  }
  
  /* Forzamos a ambos a medir el 95% simétrico en móviles */
  nav, .navbar, footer, .footer, .footer-content {
    width: 95vw !important;
    max-width: 95vw !important;
  }
}

</style>
