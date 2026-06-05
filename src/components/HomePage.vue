<script setup>
import { ref, computed, onMounted } from 'vue'
import { features, serviceTiles } from '../data/homepageContent'
import FareSearch from './FareSearch.vue'
import PortManager from './PortManager.vue'
import { getPorts } from '../services/airlineApi'

const props = defineProps({
  currentUser: { type: Object, default: null },
})

const emit = defineEmits(['logout'])

const displayName = computed(() =>
  props.currentUser?.displayName || props.currentUser?.email || 'Guest'
)

const ports = ref([])
const portsLoading = ref(true)
const portsError = ref('')

async function loadPorts() {
  portsLoading.value = true
  portsError.value = ''
  try {
    const portList = await getPorts()
    ports.value = Array.isArray(portList) ? portList : []
  } catch (err) {
    portsError.value = err.message || 'Unable to load ports.'
    ports.value = []
  } finally {
    portsLoading.value = false
  }
}

onMounted(loadPorts)
</script>

<template>
  <main class="app-shell">
    <section class="hero">
      <div class="hero__background hero__background--one" />
      <div class="hero__background hero__background--two" />

      <nav class="topbar" aria-label="Primary">
        <div class="topbar__brand-wrap">
          <img src="/logo-aerolink.png" alt="AeroLink" class="topbar__logo" />
          <div class="topbar__user-block">
            <span class="topbar__user-label">Signed in as</span>
            <span class="topbar__user-name">{{ displayName }}</span>
          </div>
        </div>

        <div class="topbar__actions">
          <a href="#services">Services</a>
          <template v-if="currentUser">
            <button type="button" class="topbar__logout" @click="emit('logout')">Logout</button>
          </template>
          <template v-else>
            <a href="#/login">Login</a>
            <a href="#/signup">Signup</a>
          </template>
        </div>
      </nav>

      <div class="hero__content">
        <div class="hero__copy">
          <span class="eyebrow">Airline booking platform</span>
          <h1>Elegant flight booking experiences built for scale.</h1>
          <p class="hero__description">
            AeroLink is designed to showcase premium signup, login, live airport ports,
            fare lookup, and baggage handling in a modern interface that feels fast, clear, and trustworthy.
          </p>

          <div class="hero__cta">
            <a class="button button--primary" href="#auth">Start booking</a>
            <a class="button button--secondary" href="#services">Explore services</a>
          </div>

          <dl class="hero__stats">
            <div>
              <dt>Booking-ready</dt>
              <dd>24/7</dd>
            </div>
            <div>
              <dt>Fare clarity</dt>
              <dd>100%</dd>
            </div>
            <div>
              <dt>Cloud fit</dt>
              <dd>AWS</dd>
            </div>
          </dl>
        </div>

        <aside class="hero__panel" id="auth" aria-label="Account access and trip summary">
          <div class="hero__panel-header">
            <span class="panel-pill panel-pill--active">Secure access</span>
            <span class="panel-pill">Live fares</span>
          </div>

          <div class="auth-card">
            <h2>Account access</h2>
            <p>Keep passengers and staff moving with a polished login and signup experience.</p>
            <div class="auth-card__buttons">
              <span v-if="currentUser" class="auth-card__signed-in">Welcome back, {{ displayName }}</span>
              <template v-else>
                <a href="#/login" class="button button--dark">Login</a>
                <a href="#/signup" class="button button--ghost">Signup</a>
              </template>
            </div>
          </div>

          <div class="baggage-card">
            <span class="fare-card__label">Baggage handling</span>
            <p>Carry-on, checked luggage, and special handling rules organized for quick review.</p>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section--search" id="fare-search">
      <div class="section__heading">
        <span class="eyebrow">Search fares</span>
        <h2>Find the right flight</h2>
      </div>
      <div class="section__content">
        <FareSearch :ports="ports" :loading-ports="portsLoading" :ports-error="portsError" />
      </div>
    </section>

    <section class="section section--management" id="ports">
      <div class="section__heading">
        <span class="eyebrow">Port management</span>
        <h2>Keep origin and destination ports in sync with the live API.</h2>
      </div>
      <div class="section__content">
        <PortManager :ports="ports" :loading="portsLoading" :error="portsError" @ports-updated="loadPorts" />
      </div>
    </section>

    <section class="section" id="services">
      <div class="section__heading">
        <span class="eyebrow">Core features</span>
        <h2>Built around the airline operations that matter most.</h2>
      </div>
      <div class="feature-grid">
        <article v-for="feature in features" :key="feature.title" class="feature-card">
          <span class="feature-card__metric">{{ feature.metric }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>
    </section>

    <section class="section section--split">
      <div class="section__heading">
        <span class="eyebrow">Platform focus</span>
        <h2>A clean visual system that can grow with the AWS backend later.</h2>
      </div>
      <div class="service-list">
        <div v-for="tile in serviceTiles" :key="tile" class="service-list__item">
          {{ tile }}
        </div>
      </div>
    </section>
  </main>
</template>
