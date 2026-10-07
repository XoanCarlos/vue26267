<template>
  <div class="xestion-doctores">
    <h4>👨‍⚕️👩‍⚕️ Xestión de Doctores</h4>
    <form @submit.prevent="guardarDoctor">
      <div class="fila">
        <div class="campo campo-id">
          <label>ID :</label>
          <input v-model="novoDoctor.iddoc" type="text" disabled />
        </div>
        <button type="button" @click="limpiaFormdoc" style="font-size: 20px; margin-righ: 1.5rem">
          🧹
        </button>
        <div class="campo campo-nome">
          <label>Nome:</label>
          <input
            id="nome"
            v-model="novoDoctor.nomedoc"
            type="text"
            required
            @blur="capitalizarTexto('nomedoc')"
          />
        </div>
        <div class="campo campo-apellido">
          <label>Apellidos:</label>
          <input
            id="apellido"
            v-model="novoDoctor.apeldoc"
            type="text"
            required
            @blur="capitalizarTexto('apeldoc')"
          />
        </div>
      </div>
      <div class="fila">
        <div class="campo campo-correo">
          <label>Correo:</label>
          <input
            v-model="novoDoctor.maildoc"
            type="email"
            :class="{ 'is-invalid': !correoValido }"
            @blur="validarcorreo"
          />
        </div>
        <div class="campo campo-movil">
          <label>Móvil:</label>
          <input
            v-model="novoDoctor.movildoc"
            type="text"
            style="text-align: center"
            :class="{ 'is-invalid': !movilValido }"
            required
            @blur="validarMovil"
          />
        </div>

        <div class="campo campo-especialidad">
          <label>Especialidad: </label>
          <select id="provincia" v-model="novoDoctor.espedoc">
            <option value="">Selecciona una Especialidad</option>

            <option
              v-for="especialidad in especialidades"
              :key="especialidad.id"
              :value="especialidad.nm"
            >
              {{ especialidad.nm }}
            </option>
          </select>
        </div>
        </div>
        <div class="fila">
          <div class="campo-colegiado">
            <label>Colegiado: </label>
            <label>
              <input type="radio" value="Si" v-model="novoDoctor.coledoc" />
              Si
            </label>
            <label>
              <input type="radio" value="No" v-model="novoDoctor.coledoc" />
              No
            </label>
          </div>
        </div>
    
      <button
        type="submit"
        class="btn-guardar"
        :disabled="
          novoDoctor.nomedoc === '' ||
          novoDoctor.apeldoc === '' ||
          novoDoctor.movildoc === '' ||
          novoDoctor.espedoc === ''
        "
      >
        Gardar
      </button>
    </form>
    <h4>📋 Listaxe de Doctores</h4>
    <table v-if="doctores.length > 0">
      <thead>
        <tr>
          <th style="text-align: center">ID</th>
          <th style="text-align: center">Código</th>
          <th style="text-align: center">Apelidos</th>
          <th style="text-align: center">Nome</th>
          <th style="text-align: center">Movil</th>
          <th style="text-align: center">Especialidad</th>
          <th style="text-align: center">Accións</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, index) in doctores" :key="index">
          <td style="text-align: center">{{ index + 1 }}</td>
          <td style="text-align: center">{{ u.iddoc }}</td>
          <td>{{ u.apeldoc }}</td>
          <td>{{ u.nomedoc }}</td>
          <td>{{ u.movildoc }}</td>
          <td style="text-align: center">{{ u.espedoc }}</td>
          <td style="text-align: center">
            <button
              style="margin-right: 5px"
              title="Editar"
              @click="editarDoctor(index)"
            >
              ✏️
            </button>
            <button title="Eliminar" @click="eliminarDoctor(index)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Non hai pacientes cargados.</p>
  </div>
</template>

<script setup>
// Importación de funciones y hooks de Vue
import { ref, reactive, onMounted } from "vue";
import { obtenerEspecialidades } from "../api/especialidades.js";
import {
  getDoctores,
  saveDoctor,
  getDoctorByEspecialidad,
  deleteDoctor,
  modifyDoctor,
} from "../api/doctores.js";

// Definición de variables reactivas
const doctores = ref([]);
const especialidades = ref([]);
const editando = ref(false);

const novoDoctor = reactive({
  iddoc: "",
  nomedoc: "",
  apeldoc: "",
  maildoc: "",
  movildoc: "",
  coledoc: "",
  espedoc: "",
});

// usamos async porque hacemos await asíncrono
onMounted(async () => {
  // Cargar doctores y especialidades al montar el componente
  //doctores.value = await cargarDoctores()
  especialidades.value = await obtenerEspecialidades();
});

// ========== FUNCIONES PRINCIPALES BBDD ============

/// ========== FUNCIONES AUXILIARES  ============

// Función única: capitaliza y asigna en el mismo paso

const capitalizarTexto = (campo) => {
  const texto = novoDoctor[campo] ?? "";
  novoDoctor[campo] = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

// validar mail

const correoValido = ref(true);

const validarcorreo = () => {
  const correo = novoDoctor.maildoc.trim();

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(correo)) {
    correoValido.value = false;
    novoDoctor.maildoc = "";
  } else {
    correoValido.value = true;
  }
};

// validar movil

const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;
const validarMovil = () => {
  const movil = novoDoctor.movildoc.trim();

  if (movil === "") {
    movilValido.value = true; // Vacío = válido (opcional)
    return true;
  }

  if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
    movilValido.value = movilRegex.test(movil);
    return movilValido.value;
  } else {
    movilValido.value = false;
    novoDoctor.movildoc = "";
    return false;
  }
};

const limpiaFormdoc = () => {
  Object.keys(novoDoctor).forEach((key) => {
    if (typeof novoDoctor[key] === "boolean") {
      novoDoctor[key] = false; // Reinicia los booleanos a false
    } else {
      novoDoctor[key] = ""; // Reinicia los demás campos a cadena vacía
    }
  });
  editando.value = false; // Reinicia el estado de edición
  correoValido.value = true; // Reinicia la validez del correo
  movilValido.value = true; // Reinicia la validez del móvil
};
</script>

<style scoped>
.xestion-doctores {
  width: 100%;
  /* opcional para que no crezca demasiado en pantallas muy grandes */
  background: white;
  padding: 1rem;
  overflow: visible;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.fila {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.fila-centrada {
  justify-content: center;
}

.campo {
  display: flex;
  align-items: center;
  /* label e input en la misma línea */
  gap: 0.3rem;
  border-radius: 0px;
}

.campo-id {
  flex: 3;
  margin-right: 2rem;
  /* ocupa menos espacio */
  border-radius: 0px;
}
.campo-colegiado {
  flex: 1;
  /* ocupa menos espacio */
  border-radius: 0px;
}
.campo-nome {
  flex: 3;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo-apellido {
  flex: 4;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo-especialidad {
  flex: 3;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo-correo {
  flex: 2;
  /* ocupa más espacio */
  border-radius: 0px;
}
.campo-movil {
  flex: 1;
  /* ocupa más espacio */
  border-radius: 0px;
}
.campo select {
  flex: 3;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 0px;
  width: 60%;
}

.campo label {
  min-width: 80px;
  /* ancho fijo para alinear */
  font-weight: 500;
  font: bold;
}

.campo input {
  flex: 1;
  /* ocupa todo el espacio restante */
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0px;
  box-sizing: border-box;
}

.btn-guardar {
  background-color: #f0f3f7;
  color: black;
  border: 3;
  border-color: #1bb191;
  padding: 0.4rem 1.5rem;
  border-radius: 0px;
  cursor: pointer;
  margin: 0 auto;
  display: block;
}
.btn-guardar:disabled {
  background-color: #e0e0e0;
  color: #999;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-guardar:disabled:hover {
  background-color: #e0e0e0;
}
.btn-guardar:hover {
  background-color: #c8eacf;
  border-radius: 0px;
}

.button {
  background: none;
  border: 2px solid #ddd;
  cursor: pointer;
  font-size: 1rem;
}

.inline-control {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding-right: 5rem;
}

table {
  width: 100%;
  border-collapse: separate;
  margin-top: 1rem;
  font-size: 0.8rem;
  border: 1px solid #ddd;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.7rem;
  text-align: left;
}

th {
  text-align: center;
  background-color: #f8f9fa;
}

h4 {
  margin-bottom: 1rem;
  font-weight: 600;
  background-color: #1ec9a4;
  color: white;
}

.is-invalid {
  border-color: #f28b82 !important;
  background-color: #ffe6e6;
}

.invalid-texto {
  display: block;
  font-size: 10px;
  color: red;
  padding-top: 0.5%;
}

@media (max-width: 768px) {
  .xestion-pacientes {
    padding: 1rem;
    /* reducir el padding en pantallas pequeñas */
  }

  .fila {
    flex-direction: column;
    /* apila los campos verticalmente en móviles */
    gap: 0.5rem;
    /* opcional: un pequeño espacio entre ellos */
  }
}
</style>
