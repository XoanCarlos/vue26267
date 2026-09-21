<template>
  <div id="app">
    <NavBar />
    <!-- Aquí se carga el router -->
         <router-view />
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
  height: 100vw;
  margin: 0 auto;
  padding-top: 1rem;
  padding-bottom: 60px;
}

/* Footer fijo abajo */
footer {
  position: fixed;
  bottom: 0;
  width: 47vw;
  width: 47vw;
  left: 50%;
  transform: translateX(-50%);
}

/* Pantallas pequeñas */
@media (max-width: 768px) {
  #app {
    max-width: 95vw;
  }
}
</style>