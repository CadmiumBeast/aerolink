<script setup>
import { ref } from 'vue'
import { createPort, deletePort, updatePort } from '../services/airlineApi'

const props = defineProps({
  ports: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['ports-updated'])

const form = ref({ name: '', code: '' })
const editingPortId = ref(null)
const message = ref('')
const busy = ref(false)

async function handleSubmit(event) {
  event.preventDefault()
  message.value = ''

  const payload = {
    name: form.value.name.trim(),
    code: form.value.code.trim().toUpperCase(),
  }

  if (!payload.name || !payload.code) {
    message.value = 'Port name and code are required.'
    return
  }

  busy.value = true
  try {
    if (editingPortId.value) {
      await updatePort(editingPortId.value, payload)
      message.value = 'Port updated successfully.'
    } else {
      await createPort(payload)
      message.value = 'Port created successfully.'
    }

    form.value = { name: '', code: '' }
    editingPortId.value = null
    emit('ports-updated')
  } catch (err) {
    message.value = err.message || 'Unable to save port.'
  } finally {
    busy.value = false
  }
}

function handleEdit(port) {
  editingPortId.value = port.id
  form.value = { name: port.name || '', code: port.code || '' }
  message.value = `Editing ${port.code}.`
}

function handleCancelEdit() {
  editingPortId.value = null
  form.value = { name: '', code: '' }
  message.value = ''
}

async function handleDelete(port) {
  if (!window.confirm(`Delete ${port.code} - ${port.name}?`)) return

  busy.value = true
  message.value = ''
  try {
    await deletePort(port.id)
    if (editingPortId.value === port.id) handleCancelEdit()
    message.value = 'Port deleted successfully.'
    emit('ports-updated')
  } catch (err) {
    message.value = err.message || 'Unable to delete port.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="port-manager" aria-label="Port management">
    <div class="port-manager__header">
      <div>
        <span class="eyebrow">Port admin</span>
        <h3>Manage origin and destination ports</h3>
        <p>Add, update, or remove ports from the live service, then use the same data for fare searches.</p>
      </div>
      <div class="port-manager__count">
        {{ loading ? 'Loading ports...' : `${ports.length} live ports` }}
      </div>
    </div>

    <div v-if="error" class="status-message status-message--error">{{ error }}</div>

    <div class="port-manager__layout">
      <form class="port-manager__form" @submit="handleSubmit">
        <div class="port-manager__form-head">
          <h4>{{ editingPortId ? 'Edit port' : 'Add new port' }}</h4>
          <button v-if="editingPortId" type="button" class="button button--secondary port-manager__cancel" @click="handleCancelEdit">
            Cancel edit
          </button>
        </div>

        <label>
          Port name
          <input v-model="form.name" placeholder="Dubai International Airport" />
        </label>

        <label>
          Port code
          <input v-model="form.code" placeholder="DXB" :maxlength="8" />
        </label>

        <div class="port-manager__actions">
          <button class="button button--primary" type="submit" :disabled="busy">
            {{ busy ? 'Saving...' : editingPortId ? 'Update port' : 'Create port' }}
          </button>
        </div>

        <div v-if="message" class="status-message">{{ message }}</div>
      </form>

      <div class="port-manager__list" aria-live="polite">
        <div v-if="loading" class="port-manager__empty">Loading the current port inventory.</div>
        <div v-else-if="ports.length === 0" class="port-manager__empty">No ports are available yet.</div>
        <template v-else>
          <article v-for="port in ports" :key="port.id" class="port-card">
            <div>
              <span class="port-card__code">{{ port.code }}</span>
              <h4>{{ port.name }}</h4>
            </div>
            <div class="port-card__actions">
              <button type="button" class="button button--secondary" @click="handleEdit(port)" :disabled="busy">Edit</button>
              <button type="button" class="button button--secondary" @click="handleDelete(port)" :disabled="busy">Delete</button>
            </div>
          </article>
        </template>
      </div>
    </div>
  </section>
</template>
