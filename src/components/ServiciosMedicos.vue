
<template>
  <div class="container mx-auto px-6 py-1">
    <p class="text-center text-gray-500 mb-5">
      Cuidamos de tu salud con profesionales especializados.
    </p>

    <!-- Tarjetas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

      <div
        v-for="(servicio, index) in servicios"
        :key="servicio.nombre"
        class="bg-white rounded-xl shadow-lg overflow-hidden
               hover:shadow-2xl hover:-translate-y-2
               transition-all duration-300"
      >

        <!-- Imagen -->
        <div class="overflow-hidden">
          <img
            :src="servicio.imagen"
            :alt="servicio.nombre"
            class="w-full h-52 object-cover efecto-pixel"
            :style="{ animationDelay: `${index * 0.25}s` }"
          />
        </div>

        <!-- Información -->
        <div class="p-5">

          <h3 class="text-xl font-bold text-gray-800 mb-3">
            {{ servicio.nombre }}
          </h3>

          <p class="text-gray-600 text-sm leading-relaxed">
            {{ servicio.descripcion }}
          </p>

          <button
            class="mt-5 bg-[#1ec9a4] hover:bg-[#16a085]
                   text-white font-semibold py-2 px-5
                   rounded-lg transition-colors duration-300"
          >
            Más información
          </button>

        </div>

      </div>

    </div>

  </div>
</template>
<script setup>

import cardiologia from '../assets/servicios/cardiologia.jpeg';
import pediatria from '../assets/servicios/pediatria.jpeg';
import oftalmologia from '../assets/servicios/oftalmologia.jpeg';
import dermatologia from '../assets/servicios/dermatologia.jpeg';
import traumatologia from '../assets/servicios/traumatologia.jpeg';
import neurologia from "../assets/servicios/neurologia.jpeg";

const servicios = [
  {
    nombre: 'Oftalmologia',
    imagen: oftalmologia,
    descripcion: 'Atención médica de la vista, prevención y diagnóstico enfermadades visuales'
  },
  {
    nombre: 'Pediatría',
    imagen: pediatria,
    descripcion: 'Atención especializada para la salud y el desarrollo infantil.'
  },
  {
    nombre: 'Cardiología',
    imagen: cardiologia,
    descripcion: 'Prevención, diagnóstico y tratamiento de enfermedades cardiovasculares.'
  },
  {
    nombre: 'Dermatología',
    imagen: dermatologia,
    descripcion: 'Diagnóstico y tratamiento de enfermedades de la piel.'
  },
  {
    nombre: 'Traumatología',
    imagen: traumatologia,
    descripcion: 'Atención de lesiones y enfermedades del aparato locomotor.'
  },
 {
    nombre: 'Neurología',
    imagen: neurologia,
    descripcion: 'Atención integral de la salud del cerebro.'
  },
];
</script>
<style scoped>

.efecto-pixel {
  animation: pixelEntrada 1.2s ease-out both;
}

@keyframes pixelEntrada {

  0% {
    opacity: 0;
    filter: blur(15px);
    transform: scale(1.1);
  }

  50% {
    opacity: 0.6;
    filter: blur(6px);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }

}

</style>