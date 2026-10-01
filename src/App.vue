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
body {
  margin: 0;
  background: #f6f6f6;
}

#app {
  max-width: 80vw;
  margin: 0 auto;
  min-height: calc(100vh - 120px); /* Altura mínima para que el contenido no se superponga con el footer */
}

.contenido{
  padding-top: 7vh;
  padding-bottom: 60px;
}

/* Navbar fijo arriba */
nav {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  z-index: 1000;
}

/* Footer fijo abajo */
footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  z-index: 1000;
}

/* Pantallas pequeñas */
@media (max-width: 768px) {
  #app {
    max-width: 95vw;
  }
}
</style>