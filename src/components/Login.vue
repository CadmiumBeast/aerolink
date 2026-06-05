<script setup>
import { ref } from 'vue'
import { login } from '../aws/cognito'

const emit = defineEmits(['close', 'login'])

const email = ref('')
const password = ref('')
const message = ref('')

async function handleSubmit(e) {
  e.preventDefault()
  message.value = ''
  try {
    const session = await login({ email: email.value, password: password.value })
    const idToken = session.getIdToken().getJwtToken()
    const payload = session.getIdToken().payload
    const displayName = payload.name ||
      [payload.given_name, payload.family_name].filter(Boolean).join(' ') ||
      payload.email ||
      email.value
    const username = payload.email || email.value
    localStorage.setItem('aerolink_id_token', idToken)
    localStorage.setItem('aerolink_user', JSON.stringify({ email: username, displayName }))
    emit('login', { email: username, displayName })
    message.value = 'Login successful'
  } catch (err) {
    message.value = err.message || 'Login failed'
  }
}
</script>

<template>
  <div class="modal-overlay" role="presentation" @click="emit('close')">
    <section class="modal-card auth-page" role="dialog" aria-modal="true" aria-labelledby="login-modal-title" @click.stop>
      <button type="button" class="modal-close" @click="emit('close')" aria-label="Close login modal">×</button>
      <div class="modal-header">
        <span class="eyebrow">Passenger login</span>
        <h2 id="login-modal-title">Login to your AeroLink account</h2>
      </div>

      <form class="auth-form" @submit="handleSubmit">
        <label>
          Email
          <input class="auth-input" v-model="email" />
        </label>
        <label>
          Password
          <input class="auth-input" type="password" v-model="password" />
        </label>
        <div class="auth-actions auth-actions--split">
          <button class="button button--secondary" type="button" @click="emit('close')">Cancel</button>
          <button class="button button--primary" type="submit">Login</button>
        </div>
      </form>

      <div v-if="message" class="auth-message">{{ message }}</div>
    </section>
  </div>
</template>
