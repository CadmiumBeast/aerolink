<script setup>
import { ref, computed } from 'vue'
import { searchFares } from '../services/airlineApi'

const props = defineProps({
  ports: { type: Array, default: () => [] },
  loadingPorts: { type: Boolean, default: false },
  portsError: { type: String, default: '' },
})

const originPortId = ref('')
const destinationPortId = ref('')
const date = ref('')
const results = ref(null)
const error = ref('')
const searching = ref(false)

const portById = computed(() => new Map(props.ports.map((port) => [String(port.id), port])))

function getPortLabel(port) {
  if (!port) return ''
  return `${port.code} - ${port.name}`
}

function formatDateTime(value) {
  if (!value) return 'Not provided'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString()
}

async function handleSearch(event) {
  event.preventDefault()
  error.value = ''
  results.value = null

  if (!originPortId.value || !destinationPortId.value || !date.value) {
    error.value = 'Please select an origin port, destination port, and travel date.'
    return
  }

  if (originPortId.value === destinationPortId.value) {
    error.value = 'Origin and destination ports must be different.'
    return
  }

  searching.value = true
  try {
    const fares = await searchFares({
      originPortId: originPortId.value,
      destinationPortId: destinationPortId.value,
      date: date.value,
    })
    results.value = Array.isArray(fares) ? fares : []
  } catch (err) {
    error.value = err.message || 'Unable to search fares.'
    results.value = null
  } finally {
    searching.value = false
  }
}
</script>

<template>
  <section class="fare-search">
    <div class="fare-search__header">
      <div>
        <span class="eyebrow">Search fares</span>
        <h3>Find fares with live ports</h3>
      </div>
      <p>
        Pick origin and destination from the live port service so the search matches the backend data.
      </p>
    </div>

    <div v-if="portsError" class="status-message status-message--error">{{ portsError }}</div>

    <form class="fare-search__form" @submit="handleSearch" aria-label="Find fares">
      <div class="fare-search__row">
        <label>
          Origin
          <select v-model="originPortId" aria-label="Origin port" :disabled="loadingPorts || ports.length === 0">
            <option value="">Select origin port</option>
            <option v-for="port in ports" :key="port.id" :value="port.id">
              {{ getPortLabel(port) }}
            </option>
          </select>
        </label>

        <label>
          Destination
          <select v-model="destinationPortId" aria-label="Destination port" :disabled="loadingPorts || ports.length === 0">
            <option value="">Select destination port</option>
            <option v-for="port in ports" :key="port.id" :value="port.id">
              {{ getPortLabel(port) }}
            </option>
          </select>
        </label>

        <label>
          Date
          <input type="date" v-model="date" aria-label="Travel date" />
        </label>
      </div>

      <div class="fare-search__actions">
        <button class="button button--primary" type="submit" :disabled="searching || loadingPorts || ports.length === 0">
          {{ searching ? 'Searching...' : 'Search' }}
        </button>
      </div>
    </form>

    <div v-if="loadingPorts" class="fare-search__hint">Loading ports from the live service.</div>
    <div v-else-if="!loadingPorts && ports.length === 0 && !portsError" class="fare-search__hint">
      No ports are available yet. Add one below before searching.
    </div>

    <div v-if="error" class="fare-search__error">{{ error }}</div>

    <div v-if="results !== null" class="fare-search__results">
      <div v-if="results.length === 0" class="fare-search__empty">
        No fares found for the selected route and date.
      </div>
      <ul v-else>
        <li v-for="f in results" :key="f.id" class="fare-search__item">
          <div>
            <strong>{{ f.flight?.airline || `Flight ${f.flight_id || f.id}` }}</strong>
            <div class="fare-search__meta">Fare #{{ f.id }}</div>
          </div>
          <div>
            {{ getPortLabel(portById.get(String(f.origin_port_id))) || f.origin_port_id }}
            →
            {{ getPortLabel(portById.get(String(f.destination_port_id))) || f.destination_port_id }}
          </div>
          <div>Depart {{ formatDateTime(f.departure_time) }}</div>
          <div>Arrive {{ formatDateTime(f.arrival_time) }}</div>
          <div class="fare-search__price">Amount {{ f.amount }}</div>
        </li>
      </ul>
    </div>
  </section>
</template>
