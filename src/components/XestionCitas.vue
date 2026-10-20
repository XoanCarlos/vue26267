
<template>
  <div class="xestion-citas">
    <h4>📅 Xestión de Citas 🩺</h4>

    <form @submit.prevent="guardarCita">
      <!-- Primeira fila -->
      <div class="fila">
        <div class="campo campo-id">
          <label>ID:</label>
          <input v-model="novaCita._id" type="text" disabled />
        </div>

        <button
          type="button"
          @click="limpiaFormcita"
          style="font-size: 20px; width: 36px; height: 36px;"
          title="Limpar formulario"
        >
          🧹
        </button>

        <div class="campo campo-paciente">
          <label>Paciente:</label>
          <select v-model="novaCita.pacienteId" required>
            <option value="">Selecciona un paciente</option>
            <option
              v-for="paciente in pacientes"
              :key="paciente._id"
              :value="paciente._id"
            >
              {{ paciente.nomepac }} {{ paciente.apelpac }}
            </option>
          </select>
        </div>

        <div class="campo campo-doctor">
          <label>Doctor:</label>
          <select v-model="novaCita.doctorId" required>
            <option value="">Selecciona un doctor</option>
            <option
              v-for="doctor in doctores"
              :key="doctor._id"
              :value="doctor._id"
            >
              {{ doctor.nomedoc }} {{ doctor.apeldoc }}
            </option>
          </select>
        </div>
      </div>

      <!-- Segunda fila -->
      <div class="fila">
        <div class="campo campo-fecha">
          <label>Data:</label>
          <input
            v-model="novaCita.fecha"
            type="date"
            required
          />
        </div>

        <div class="campo campo-hora">
          <label>Hora:</label>
          <input
            v-model="novaCita.hora"
            type="time"
            required
          />
        </div>

        <div class="campo campo-motivo">
          <label>Motivo:</label>
          <input
            v-model="novaCita.motivo"
            type="text"
            placeholder="Motivo da cita"
            required
          />
        </div>

        <div class="campo campo-estado">
          <label>Estado:</label>
          <select v-model="novaCita.estado" required>
            <option value="pendente">Pendente</option>
            <option value="confirmada">Confirmada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <!-- Terceira fila: textarea -->
      <div class="fila">
        <div class="campo campo-observacions">
          <label for="observacions">Observacións:</label>
          <textarea
            id="observacions"
            v-model="novaCita.observacions"
            rows="3"
            placeholder="Escribe as observacións da cita..."
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="btn-guardar"
        :disabled="
          novaCita.pacienteId === '' ||
          novaCita.doctorId === '' ||
          novaCita.fecha === '' ||
          novaCita.hora === '' ||
          novaCita.motivo.trim() === ''
        "
      >
        Gardar
      </button>
    </form>

    <!-- Listaxe de citas -->
    <h4>
      📋 Listaxe de Citas
      <button
        type="button"
        @click="recargarCitas()"
        style="width: 28px; height: 28px; padding: 2px; margin: 0 auto;"
        title="Recargar citas"
      >
        ⟳
      </button>
    </h4>

    <table v-if="citas.length > 0">
      <thead>
        <tr>
          <th style="text-align: center">ID</th>
          <th>Paciente</th>
          <th>Doctor</th>
          <th style="text-align: center">Data</th>
          <th style="text-align: center">Hora</th>
          <th>Motivo</th>
          <th style="text-align: center">Estado</th>
          <th style="text-align: center">Accións</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(cita, index) in citas" :key="cita._id">
          <td style="text-align: center">
            {{ index + 1 }}
          </td>

          <td>
            {{ cita.pacienteId?.nomepac }}
            {{ cita.pacienteId?.apelpac }}
          </td>

          <td>
            {{ cita.doctorId?.nomedoc }}
            {{ cita.doctorId?.apeldoc }}
          </td>

          <td style="text-align: center">
            {{ cita.fecha }}
          </td>

          <td style="text-align: center">
            {{ cita.hora }}
          </td>

          <td>{{ cita.motivo }}</td>

          <td style="text-align: center">
            {{ cita.estado }}
          </td>

          <td style="text-align: center">
            <button
              type="button"
              style="margin-right: 5px"
              title="Editar"
              @click="editarCita(index)"
            >
              ✏️
            </button>

            <button
              type="button"
              title="Eliminar"
              @click="eliminarCita(index)"
            >
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>
      Non hai citas cargadas ou falla a conexión coa BBDD.
    </p>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

</script>