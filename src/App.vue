<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import HomePage from './components/HomePage.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('aerolink_user') || 'null')
  } catch {
    return null
  }
}

const route = ref(window.location.hash || '#/')
const currentUser = ref(getStoredUser())

const isAuthModal = computed(() =>
  route.value.startsWith('#/signup') || route.value.startsWith('#/login')
)

const activeModal = computed(() => {
  if (route.value.startsWith('#/signup')) return 'signup'
  if (route.value.startsWith('#/login')) return 'login'
  return null
})

function onHash() {
  route.value = window.location.hash || '#/'
}

function onKeyDown(event) {
  if (event.key === 'Escape' && isAuthModal.value) {
    window.location.hash = '#/'
  }
}

onMounted(() => {
  window.addEventListener('hashchange', onHash)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHash)
  window.removeEventListener('keydown', onKeyDown)
})

watch(isAuthModal, (val) => {
  document.body.classList.toggle('modal-open', val)
}, { immediate: true })

function closeModal() {
  window.location.hash = '#/'
}

function handleLogin(user) {
  currentUser.value = user
  closeModal()
}

function handleLogout() {
  localStorage.removeItem('aerolink_id_token')
  localStorage.removeItem('aerolink_user')
  currentUser.value = null
  closeModal()
}
</script>

<template>
  <HomePage :current-user="currentUser" @logout="handleLogout" />
  <Login v-if="activeModal === 'login'" @close="closeModal" @login="handleLogin" />
  <Signup v-if="activeModal === 'signup'" @close="closeModal" />
</template>
