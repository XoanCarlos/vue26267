<template>
  <div class="xestion-pacientes">
    <h4>👥 Xestión de Pacientes</h4>
    <form @submit.prevent="gardarUsuario">
      <div class="fila">
        <div class="campo campo-dni">
          <label>DNI/CIF:</label>
          <input
            v-model="novoPaciente.dni"
            type="text"
            required
            style="text-align: center"
            @blur="validarDni"
            :class="{ 'is-invalid': !dniValido }"
          />
        </div>
        <div v-if="!dniValido" class="invalid-texto d-block">
          DNI o NIE inválido.
        </div>
        <div class="campo campo-nome">
          <label>Nome:</label>
          <input v-model="novoPaciente.nome" type="text" required id="nome"  @blur="capitalizarTexto('nome')"/>
        </div>
        <div class="campo campo-apellido">
          <label>Apellidos:</label>
          <input v-model="novoPaciente.apellido" id="apellido" @blur="capitalizarTexto('apellido')" type="text" required />
        </div>
      </div>
      <div class="fila">
        <div class="campo campo-fecha">
          <label>Fecha Nacimiento:</label>
          <input v-model="novoPaciente.nacimiento" type="date" placeholder="dd/mm/yyyy" required />
        </div>
        <div class="campo campo-correo">
          <label>Correo:</label>
          <input v-model="novoPaciente.correo" type="email" />
        </div>
        <div class="campo campo-correo">
          <label>Móvil:</label>
          <input v-model="novoPaciente.movil" type="text" required />
        </div>
      </div>
      <div class="fila fila-centrada">
        <div class="campo campo-direccion">
          <label>Direccion:</label>
          <input v-model="novoPaciente.direccion" type="text" required />
        </div>
      </div>
      <button
        type="submit"
        class="btn-guardar"
        :disabled="novoPaciente.dni === '' || novoPaciente.nome === ''"
      >
        Gardar
      </button>
    </form>
    <h4>📋 Listaxe de usuarios</h4>
    <table v-if="usuarios.length > 0">
      <thead>
        <tr>
          <th>#</th>
          <th>DNI/CIF</th>
          <th>Nome</th>
          <th>Correo</th>
          <th>Provincia</th>
          <th>Activo</th>
          <th>Tipo de conta</th>
          <th>Accións</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, index) in usuarios" :key="index">
          <td>{{ index + 1 }}</td>
          <td style="text-align: center">{{ u.dni }}</td>
          <td>{{ u.nome }}</td>
          <td>{{ u.correo }}</td>
          <td>{{ u.provincia }}</td>
          <td style="text-align: center">{{ u.activo ? "✅" : "❌" }}</td>
          <td>{{ u.tipoCuenta }}</td>
          <td style="text-align: center">
            <button @click="editarUsuario(index)" title="Editar">✏️</button>
            <button @click="eliminarUsuario(index)" title="Eliminar">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Non hai usuarios cargados.</p>
  </div>
</template>

<script setup>
/// Zona de declaracións
import { ref, reactive, onMounted } from "vue";

const usuarios = ref([]); //almacena la lista de usuarios e os seus cambios

const novoPaciente = reactive({
  dni: "",
  nome: "",
  apellido:"",
  correo: "",
  movil: "",
  direccion: "",  
  provincia: "",
  activo: false,
  tipoCuenta: "",
});

/// Zona de ciclo de vida

onMounted(() => {
  //sempre se cargan estos usuarios de exemplo ao iniciar o componente
  usuarios.value = [
    {
      dni: "A000000C",
      nome: "Soldaduras SL",
      correo: "soldadura@email.com",
      provincia: "A Coruña",
      activo: true,
      tipoCuenta: "empresa",
    },
    {
      dni: "0000000C",
      nome: "María Pérez",
      correo: "maria@email.com",
      provincia: "Lugo",
      activo: false,
      tipoCuenta: "particular",
    },
    {
      dni: "B1234567D",
      nome: "Xosé López",
      correo: "xose@email.com",
      provincia: "Ourense",
      activo: true,
      tipoCuenta: "particular",
    },
    {
      dni: "C9876543E",
      nome: "Construcións Modernas",
      correo: "construcion@email.com",
      provincia: "Pontevedra",
      activo: true,
      tipoCuenta: "empresa",
    },
  ];
});

/// Zona de métodos ou funcións bbdd

function gardarUsuario() {
  usuarios.value.push({ ...novoPaciente }) //engade o novo usuario á lista (copia do obxecto)
  //Object.assign(novoPaciente, { dni: "", nome: "", correo: "", provincia: "", activo: false, tipoCuenta: "" }) //reinicia o formulario
}

function eliminarUsuario(index) {
  usuarios.value.splice(index, 1) //elimina o usuario da lista
}

function editarUsuario(index) {
  const usuario = usuarios.value[index] //carga os datos do usuario elixido no formulario
  Object.assign(novoPaciente, usuario) // carga os datos do usuario no formulario recorda v-model do formulario é novoPaciente
}

//  =====================================================
// funciones auxiliares

// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive
const dniValido = ref(true); // Por defecto es válido y no muestra error al iniciar

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE"
  const dniRegex = /^[0-9]{8}[A-Z]$/
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/

  valor = valor.toUpperCase();

  if (dniRegex.test(valor)) {
    const numero = parseInt(valor.slice(0, 8), 10)
    const letra = valor.charAt(8)
    return letra === letras[numero % 23]; //sale con true si es válido
  } else if (nieRegex.test(valor)) {
    const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2")
    const numero = parseInt(nie.slice(0, 8), 10)
    const letra = valor.charAt(8)
    return letra === letras[numero % 23] //sale con true si es válido
  }
  novoPaciente.dni = ""
  return false;
};

// Validar al salir del campo
const validarDni = () => {
  novoPaciente.dni = novoPaciente.dni.trim().toUpperCase();
  dniValido.value = validarDniNie(novoPaciente.dni);
  // Actualiza el estado de validez
};

// capitalizar nombre y apelidos

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
</script>

<style scoped>
.xestion-pacientes {
  width: 100%;
  /* opcional para que no crezca demasiado en pantallas muy grandes */
  background: white;
  padding: 2rem;
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
  margin-bottom: 2rem;
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
  gap: 0.5rem;
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
  width: 100%;
}

.campo-provincia {
  flex: 1;
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
  background-color: #1bb191;
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
