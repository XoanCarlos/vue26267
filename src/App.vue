<template>
  <div id="app" class="w-full max-w-[95vw] md:max-w-[80vw] mx-auto min-h-screen flex flex-col text-center box-border">
    <NavBar />
    <main class="pt-[70px] pb-[70px] flex-grow w-full">
      <router-view />
    </main>
    <FooTer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooTer from './components/FooTer.vue'
</script>
