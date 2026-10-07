<template>
  <div class="xestion-pacientes">
    <h4>👥 Xestión de Pacientes</h4>
    <form @submit.prevent="guardarPaciente">
      <div class="fila">
        <div class="campo campo-dni">
          <label>DNI/CIF:</label>
          <input
            v-model="novoPaciente.dnipac"
            type="text"
            required
            style="text-align: center"
            :class="{ 'is-invalid': !dniValido }"
            @blur="validarDni"
          />
        </div>
        <button type="button" @click="buscarPaciente" style="font-size: 20px;" >🔎</button>
        <button type="button" @click="limpiaFormpac" style="font-size: 20px;">🧹</button>
        <div v-if="!dniValido" class="invalid-texto d-block">
          DNI o NIE inválido.
        </div>
        <div class="campo campo-nome">
          <label>Nome:</label>
          <input
            id="nome"
            v-model="novoPaciente.nomepac"
            type="text"
            required
            @blur="capitalizarTexto('nomepac')"
          />
        </div>
        <div class="campo campo-apellido">
          <label>Apellidos:</label>
          <input
            id="apellido"
            v-model="novoPaciente.apelpac"
            type="text"
            required
            @blur="capitalizarTexto('apelpac')"
          />
        </div>
      </div>
      <div class="fila">
        <div class="campo campo-fecha">
          <label>Fecha Nacimiento:</label>
          <input
            v-model="novoPaciente.nacipac"
            type="date"
            placeholder="dd/mm/yyyy"
            required
          />
        </div>
        <div class="campo campo-correo">
          <label>Correo:</label>
          <input
            v-model="novoPaciente.mailpac"
            type="email"
            :class="{ 'is-invalid': !correoValido }"
            @blur="validarcorreo"
          />
        </div>
        <div class="campo campo-movil">
          <label>Móvil:</label>
          <input
            v-model="novoPaciente.movilpac"
            type="text"
            style="text-align: center"
            :class="{ 'is-invalid': !movilValido }"
            required
            @blur="validarMovil"
          />
        </div>
      </div>
      <div class="fila fila-centrada">
        <div class="campo campo-direccion">
          <label>Direccion:</label>
          <input v-model="novoPaciente.dirpac" type="text" />
        </div>
        <div class="campo campo-provincia">
          <label>Provincia</label>
          <select
            id="provincia"
            v-model="novoPaciente.propac"
            @change="cargarMunicipios"
          >
            <option value="">Selecciona una provincia</option>

            <option
              v-for="provincia in provincias"
              :key="provincia.id"
              :value="provincia.nm"
            >
              {{ provincia.nm }}
            </option>
          </select>
        </div>
        <div class="campo campo-municipio">
          <label>Municipio</label>
          <select id="municipio" v-model="novoPaciente.munipac">
            <option value="">Selecciona un municipio</option>

            <option
              v-for="municipio in municipios"
              :key="municipio.id"
              :value="municipio.nm"
            >
              {{ municipio.nm }}
            </option>
          </select>
        </div>
      </div>

      <div class="campo-condicions">
        <label>
          <input v-model="novoPaciente.lopdpac" type="checkbox" />Aceptar a
          <!-- Como usasr vue-router desde el componente usando $router -->
          <a
            :href="$router.resolve({ name: 'PoliticaPrivacidad' }).href"
            target="_blank"
            rel="noopener noreferrer"
          >
            política de privacidad e confidencialidade.
          </a>
        </label>
      </div>

      <button
        type="submit"
        class="btn-guardar"
        :disabled="
          novoPaciente.dnipac === '' ||
          novoPaciente.nomepac === '' ||
          novoPaciente.apelpac === '' ||
          !novoPaciente.lopdpac
        "
      >
        Gardar
      </button>
    </form>
    <h4>📋 Listaxe de Pacientes</h4>
    <table v-if="pacientes.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>DNI/CIF</th>
          <th>Apelidos</th>
          <th>Nome</th>
          <th>Correo</th>
          <th>Provincia</th>
          <th>Accións</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, index) in pacientes" :key="index">
          <td style="text-align: center">{{ index + 1 }}</td>
          <td style="text-align: center">{{ u.dnipac }}</td>
          <td>{{ u.apelpac }}</td>
          <td>{{ u.nomepac }}</td>
          <td>{{ u.mailpac }}</td>
          <td>{{ u.propac }}</td>
          <td style="text-align: center">
            <button
              style="margin-right: 5px"
              title="Editar"
              @click="editarUsuario(index)"
            >
              ✏️
            </button>
            <button title="Eliminar" @click="eliminarPaciente(index)">
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Non hai pacientes cargados.</p>
  </div>
</template>

<script setup>
/// Zona de importaciones
import { ref, reactive, onMounted } from "vue";
import { obtenerMunicipios, obtenerProvincias } from "../api/municipios.js";
import {
  getPacientes,
  savePaciente,
  deletePaciente,
  modifyPaciente,
  getPacienteByDni, // Importa la función para buscar paciente por DNI
} from "../api/pacientes.js";

// Zona de variables reactivas y referencias
const provincias = ref([]);
const municipios = ref([]);

const pacientes = ref([]); //almacena la lista de pacientes e os seus cambios
const editando = ref(false); // Indica si estamos editando un paciente existente


const novoPaciente = reactive({
  dnipac: "",
  nomepac: "",
  apelpac: "",
  nacipac: "",
  mailpac: "",
  movilpac: "",
  dirpac: "",
  propac: "",
  munipac: "",
  lopdpac: false, // Nuevo campo para la aceptación de la LOPD
});

// usamos async porque estamos haciendo
// operacione asíncronas con await

onMounted(async () => {
  provincias.value = await obtenerProvincias();
  pacientes.value = await getPacientes();
});

/// Zona de métodos ou funcións bbdd

async function cargarMunicipios() {
  // Si no hay provincia seleccionada, vaciamos los municipios
  if (novoPaciente.propac === "") {
    municipios.value = [];
    return;
  }

  const provincia = provincias.value.find((p) => p.nm === novoPaciente.propac);

  // Obtenemos los municipios de la provincia seleccionada
  municipios.value = await obtenerMunicipios(provincia.id);
}

async function guardarPaciente() {

  try {

    if (editando.value) {
      // Modificar paciente existente
      const pacienteModificado = await modifyPaciente(
        novoPaciente.dnipac,
        novoPaciente
      );

      const index = pacientes.value.findIndex(
        (p) => p.dnipac === novoPaciente.dnipac
      );

      if (index !== -1) {
        pacientes.value[index] = pacienteModificado;
      }
      console.log("Paciente modificado correctamente");
    } else {
      // Guardar nuevo paciente
      await savePaciente(novoPaciente);    
      console.log("Paciente gardado correctamente");
    }

    editando.value = false;

  } catch (error) {
    console.error("Error ao gardar paciente:", error);
  }
  pacientes.value = await getPacientes(); // Actualiza la lista de pacientes después de guardar
}

async function eliminarPaciente(index) {
  try {
    await deletePaciente(pacientes.value[index].dnipac);
    pacientes.value.splice(index, 1); // Elimina el paciente de la lista local
    console.log("Paciente eliminado correctamente");
    getPacientes(); // Actualiza la lista de pacientes después de eliminar
  } catch (error) {
    console.error("Error ao eliminar paciente:", error);
  }
  pacientes.value = await getPacientes(); // Actualiza la lista de pacientes después de eliminar
}

async function editarUsuario(index) {
  const paciente = pacientes.value[index]; //carga os datos do paciente elixido no formulario
  Object.assign(novoPaciente, paciente); // carga os datos do paciente no formulario recorda v-model do formulario é novoPaciente
  //evitar que se cargue el _id de mongoDB en el formulario    o bien esta forma
  delete novoPaciente._id;
  editando.value = true;
  // Cargar los municipios de la provincia del paciente
  await cargarMunicipios();

}

async function buscarPaciente() {
  try {
    const dni = novoPaciente.dnipac.trim();

    if (!dni) {
      console.log("Introduce un DNI");
      return;
    }

    const paciente = await getPacienteByDni(dni);

    Object.assign(novoPaciente, paciente);
    await cargarMunicipios(); // Cargar los municipios de la provincia del paciente

    console.log("Paciente encontrado:", paciente);

  } catch (error) {
    if (error.response?.status === 404) {
      console.log("Paciente no encontrado");
    } else {
      console.error("Error al buscar paciente:", error);
    }
  }
}

//  ============== FUNCIONES AUXILIARES =====================

// limpiar formulario

const limpiaFormpac = () => {
  Object.keys(novoPaciente).forEach((key) => {
    if (typeof novoPaciente[key] === "boolean") {
      novoPaciente[key] = false; // Reinicia los booleanos a false
    } else {
      novoPaciente[key] = ""; // Reinicia los demás campos a cadena vacía
    }
  });
  editando.value = false; // Reinicia el estado de edición
  dniValido.value = true; // Reinicia la validez del DNI/NIE
  correoValido.value = true; // Reinicia la validez del correo
  movilValido.value = true; // Reinicia la validez del móvil
};

// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive
const dniValido = ref(true); // Por defecto es válido y no muestra error al iniciar

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  valor = valor.toUpperCase();

  if (dniRegex.test(valor)) {
    const numero = parseInt(valor.slice(0, 8), 10);
    const letra = valor.charAt(8);
    return letra === letras[numero % 23]; //sale con true si es válido
  } else if (nieRegex.test(valor)) {
    const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2");
    const numero = parseInt(nie.slice(0, 8), 10);
    const letra = valor.charAt(8);
    return letra === letras[numero % 23]; //sale con true si es válido
  }
  novoPaciente.dnipac = "";
  return false;
};

// Validar al salir del campo
const validarDni = () => {
  novoPaciente.dnipac = novoPaciente.dnipac.trim().toUpperCase();
  dniValido.value = validarDniNie(novoPaciente.dnipac);
  // Actualiza el estado de validez
};

// Función única: capitaliza y asigna en el mismo paso
const capitalizarTexto = (campo) => {
  const texto = novoPaciente[campo] ?? "";
  novoPaciente[campo] = texto
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
  const correo = novoPaciente.mailpac.trim();

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(correo)) {
    correoValido.value = false;
    novoPaciente.mailpac = "";
  } else {
    correoValido.value = true;
  }
};

// validar movil

const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;
const validarMovil = () => {
const movil = novoPaciente.movilpac.trim();

  if (movil === "") {
    movilValido.value = true; // Vacío = válido (opcional)
    return true;
  }

  if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
    movilValido.value = movilRegex.test(movil);
    return movilValido.value;
  } else {
    movilValido.value = false;
    novoPaciente.movilpac = "";
    return false;
  }
};
</script>

<style scoped>
.xestion-pacientes {
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

.campo-dni {
  flex: 1;
  /* ocupa menos espacio */
  border-radius: 0px;
}

.campo-nome {
  flex: 4;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo-apellido {
  flex: 4;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo-direccion {
  flex: 4;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo-provincia {
  flex: 1;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo-correo {
  flex: 2;
  /* ocupa más espacio */
  border-radius: 0px;
}

.campo select {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 0px;
  width: 60%;
}

.campo-provincia {
  flex: 3;
  /* ocupa menos espacio */
  border-radius: 0px;
}

.campo-municipio {
  flex: 3;
  /* ocupa menos espacio */
  border-radius: 0px;
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
