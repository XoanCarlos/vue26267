import { defineStore } from 'pinia';

export const usedoctorStore = defineStore('doctor', {
  state: () => ({
    id: null,
    nombre: null,
    apellido: null,
    especialidad: null,
    }),

    actions: {
        seleccionarDoctor(doctor) {
            this.id = doctor._id,
            this.nombre = doctor.nomedoc,
            this.apellido = doctor.apeldoc,
            this.especialidad = doctor.espedoc
        },
        limpiarDoctor() {
            this.id = null,
            this.nombre = null,
            this.apellido = null,
            this.especialidad = null
        }
    }
});    
            