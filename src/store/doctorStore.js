import { defineStore } from 'pinia';

export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    id: null,
    nombre: null,
    apellido: null,
    especialidad: null,
    }),
    actions: {
        seleccionarDoctor(doctor) {
            this.id = doctor.id,
            this.nombre = doctor.nombre,
            this.apellido = doctor.apellido,
            this.especialidad = doctor.especialidad
        },
        limpiarDoctor() {
            this.id = null,
            this.nombre = null,
            this.apellido = null,
            this.especialidad = null
        }
    }
});    
            