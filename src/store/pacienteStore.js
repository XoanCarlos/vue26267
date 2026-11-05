// Importamos defineStore de Pinia para crear un almacén de datos (store)
import { defineStore } from 'pinia'

// Creamos el store de pacientes.
// 'paciente' es el identificador único de este store.
export const usepacienteStore = defineStore('paciente', {

  // STATE: contiene los datos que queremos compartir
  // entre los diferentes componentes de Vue.
  state: () => ({
    pacientes: [],   // Array donde podemos almacenar todos los pacientes.
    dnipac: null,    // DNI del paciente seleccionado.
    nomepac: null,   // Nombre del paciente seleccionado.
    apelpac: null,   // Apellidos del paciente seleccionado.
  }),

  // ACTIONS: contiene las funciones que permiten modificar
  // los datos almacenados en el state.
  actions: {

    // Recibe un objeto paciente como parámetro.
    // Guarda sus datos en el store de Pinia.
    seleccionarPaciente(paciente) {

      this.dnipac = paciente.dnipac;   // Guardamos el DNI.
      this.nomepac = paciente.nomepac; // Guardamos el nombre.
      this.apelpac = paciente.apelpac; // Guardamos los apellidos.

    },

    // Limpia los datos del paciente seleccionado.
    // Es útil cuando queremos deseleccionar un paciente.
    limpiarPaciente() {

      this.dnipac = null;   // Borramos el DNI.
      this.nomepac = null;  // Borramos el nombre.
      this.apelpac = null; // Borramos los apellidos.

    }
  }
});