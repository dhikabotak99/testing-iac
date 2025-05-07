export default defineNuxtRouteMiddleware(() => {
  const authStore = useCookie('authStore')
  if (!authStore.value) {
    return navigateTo('/login')
  }
})
