<script setup>
import { ref } from 'vue'
import { signUp, confirmSignUp } from '../aws/cognito'

const emit = defineEmits(['close'])

const givenName = ref('')
const familyName = ref('')
const birthdate = ref('')
const email = ref('')
const phoneNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const step = ref('form') // 'form' | 'confirm' | 'done'
const message = ref('')
const code = ref('')

async function handleSubmit(e) {
  e.preventDefault()
  message.value = ''

  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match.'
    return
  }

  if (!birthdate.value) {
    message.value = 'Birthday is required.'
    return
  }

  try {
    await signUp({
      email: email.value,
      phoneNumber: phoneNumber.value,
      givenName: givenName.value,
      familyName: familyName.value,
      birthdate: birthdate.value,
      password: password.value,
    })
    step.value = 'confirm'
    message.value = 'Signup initiated. Please check your email or phone for a verification code.'
  } catch (err) {
    message.value = err.message || 'Signup failed'
  }
}

async function handleConfirm(e) {
  e.preventDefault()
  message.value = ''
  try {
    await confirmSignUp({ email: email.value, code: code.value })
    step.value = 'done'
    message.value = 'Account confirmed. You can now login.'
  } catch (err) {
    message.value = err.message || 'Confirmation failed'
  }
}
</script>

<template>
  <div class="modal-overlay" role="presentation" @click="emit('close')">
    <section class="modal-card auth-page" role="dialog" aria-modal="true" aria-labelledby="signup-modal-title" @click.stop>
      <button type="button" class="modal-close" @click="emit('close')" aria-label="Close signup modal">×</button>
      <div class="modal-header">
        <span class="eyebrow">Passenger signup</span>
        <h2 id="signup-modal-title">Create your AeroLink account</h2>
      </div>

      <form v-if="step === 'form'" class="auth-form" @submit="handleSubmit">
        <div class="auth-grid auth-grid--two">
          <label>
            First name
            <input class="auth-input" v-model="givenName" />
          </label>
          <label>
            Last name
            <input class="auth-input" v-model="familyName" />
          </label>
        </div>
        <label>
          Birthday
          <input class="auth-input" type="date" v-model="birthdate" />
        </label>
        <label>
          Email
          <input class="auth-input" v-model="email" />
        </label>
        <label>
          Phone number
          <input class="auth-input" type="tel" v-model="phoneNumber" placeholder="+250700000000" />
        </label>
        <label>
          Password
          <input class="auth-input" type="password" v-model="password" />
        </label>
        <label>
          Confirm password
          <input class="auth-input" type="password" v-model="confirmPassword" />
        </label>
        <div class="auth-actions auth-actions--split">
          <button class="button button--secondary" type="button" @click="emit('close')">Cancel</button>
          <button class="button button--primary" type="submit">Create account</button>
        </div>
      </form>

      <form v-else-if="step === 'confirm'" class="auth-form" @submit="handleConfirm">
        <label>
          Confirmation code
          <input class="auth-input" v-model="code" />
        </label>
        <div class="auth-actions auth-actions--split">
          <button class="button button--secondary" type="button" @click="emit('close')">Close</button>
          <button class="button button--primary" type="submit">Confirm</button>
        </div>
      </form>

      <div v-else-if="step === 'done'" class="auth-confirmation">
        <p>{{ message }}</p>
        <div class="auth-actions auth-actions--split">
          <button class="button button--secondary" type="button" @click="emit('close')">Close</button>
          <a href="#/login" class="button button--primary" @click="emit('close')">Go to login</a>
        </div>
      </div>

      <div v-if="message && step !== 'done'" class="auth-message">{{ message }}</div>
    </section>
  </div>
</template>
