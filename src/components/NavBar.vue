<template>
  <nav class="navbar">
    <div class="logo">
      <img :src="logo" alt="Sanidad Teis" style="width: 30px; height: 30px; margin-right: 0.5rem;"  />
      <span>Sanidad Teis</span>
    </div>

    <!-- NUEVO -->
    <button class="hamburger" @click="isOpen = !isOpen">☰</button>

    <!-- MODIFICADO -->
    <ul :class="['menu', { open: isOpen }]">
      <li><RouterLink to="/">Inicio</RouterLink></li>
      <li><RouterLink to="/xestion-pacientes">Pacientes</RouterLink></li>
      <li><RouterLink to="/xestion-doctores">Doctores</RouterLink></li>
      <li><RouterLink to="/xestion-citas">Citas</RouterLink></li>
      <li><RouterLink to="/sobrenos">Sobre nós</RouterLink></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue" 
const isOpen = ref(false) 
import logo from "../assets/img/favicon2.png"
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 0.5rem 3rem; 
  background: #1ca285;
  color: white;
  width: 100%;
  box-sizing: border-box;
  position: relative; /* CLAVE: Permite centrar el menú de forma matemática respecto a toda la barra */
  height: 50px; /* Definimos un alto fijo para estabilizar el diseño */
}

.logo {
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  z-index: 10; /* Asegura que el logo se vea por encima */
}

/* EL MENÚ QUEDA MATEMÁTICAMENTE CENTRADO EN LA BARRA */
.menu {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  
  /* Rompe el flex-between y fuerza el centrado absoluto exacto */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
}

.menu a.router-link-active {
  border-bottom: 0.2rem solid #ffe66d;
}

/* BOTÓN HAMBURGUESA */
.hamburger {
  display: none;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  background: #1ca285;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  right: 2rem; /* Lo anclamos a la derecha */
  z-index: 10;
}

/* DISEÑO RESPONSIVE (MÓVILES) */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .menu {
    display: none;
    position: absolute;
    top: 100%; 
    left: 0;
    right: 0;
    transform: none; /* Desactivamos el centrado de escritorio en móvil */
    flex-direction: column;
    background: #1ca285;
    padding: 1rem 3rem; 
    width: 100%; 
    box-sizing: border-box;
    z-index: 1001;
    gap: 1rem;
  }

  .menu.open {
    display: flex;
  }
}
</style>
