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
      <li><RouterLink to="/sobrenos">Sobre nós</RouterLink></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue" // será boolean
const isOpen = ref(false) // actívase cuando fago click
import logo from "../assets/img/favicon2.png"
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 3rem;
  background: #1ca285;
  color: white;
}

.logo {
  font-weight: bold;
  font-size: 1rem;
}

.menu {
  display: flex;
  gap: 0.8rem;
  list-style: none;
}

.menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.menu a.router-link-active {
  border-bottom: 0.2rem solid #ffe66d;
}

/* NUEVO */
.hamburger {
  display: none;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  background: #1ca285;
  border: none;
  color: white;
  font-size: 1.5rem;
}

/* NUEVO (responsive) */
@media (max-width: 768px) {
  .hamburger {
    display: block;
    margin-right: 1rem;
  }

  .menu {
    display: none;
    position: absolute;
    margin-right: 3rem;
    top: 20px;
    right: 0;
    flex-direction: column;
    background: #1ca285;
    padding: 1rem;
  }

  .menu.open {
    display: flex;
  }
}
</style>
