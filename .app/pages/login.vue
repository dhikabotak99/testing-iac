<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

useHead({
  title: 'Login Admin',
  meta: [
    { name: 'description', content: 'My amazing dashboard.' },
  ],
})

definePageMeta({
  layout: 'empty',
  title: 'Login',
  preview: {
    title: 'Login',
    description: 'For authentication and sign in',
    categories: ['layouts', 'authentication'],
    src: '/img/screens/auth-login-3.png',
    srcDark: '/img/screens/auth-login-3-dark.png',
    order: 153,
  },
})

// onMounted(() => {
//   if (useCookie('authStore').value) {
//     router.push({ path: '/', replace: true })
//   }
// })

const VALIDATION_TEXT = {
  USERNAME_REQUIRED: 'A valid username is required',
  PASSWORD_REQUIRED: 'A password is required',
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z.object({
  username: z.string().min(1, VALIDATION_TEXT.USERNAME_REQUIRED),
  password: z.string().min(1, VALIDATION_TEXT.PASSWORD_REQUIRED),
})

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  username: '',
  password: '',
} satisfies FormInput

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
  meta,
  values,
  errors,
  resetForm,
  setFieldValue,
  setErrors,
} = useForm({
  validationSchema,
  initialValues,
})

const router = useRouter()
const toaster = useToaster()
const config = useRuntimeConfig()
// const authStore = useAuthStore()

const data_user = ref({
  token: null,
  user: {},
})

const route = useRoute() // Inisialisasi useRoute
const redirectParam = route.query.r // Mendapatkan nilai parameter 'r'

// This is where you would send the form data to the server
const onSubmit = handleSubmit((values) => {
  // here you have access to the validated form values
  // console.log('auth-success', values)

  try {
    // fake delay, this will make isSubmitting value to be true
    $fetch(config.public.baseUrl + '/api/admin/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: values,
    })
      .then((data) => {
        // console.log(data)
        toaster.clearAll()
        toaster.show({
          title: 'Berhasil',
          message: `Selamat Datang Kembali!`,
          color: 'success',
          icon: 'ph:user-circle-fill',
          closable: true,
        })

        // const token = useCookie('token')
        // token.value = data.data.access_token

        data_user.value.token = data.data.access_token
        data_user.value.user = data.data.user
        // console.log(data_user)

        const authStore = useCookie('authStore')
        authStore.value = data_user.value
        // authStore.setLogged(data.data.user, x.data.user.type)

        // Redirect jika parameter 'r' ada
        // if (redirectParam) {
        //   router.replace(redirectParam)
        // }
        // else {
        router.push({ path: '/', replace: true })
        location.reload()
        // }
        // router.push({ path: '/', replace: true })
      })
      .catch((error) => {
        // console.log(error)
        toaster.clearAll()
        toaster.show({
          title: 'Gagal',
          message: `Username atau password yang anda masukkan salah!`,
          color: 'danger',
          icon: 'ph:user-circle-fill',
          closable: true,
        })
      })
  }
  catch (error: any) {
    // this will set the error on the form
    if (error.message === 'Fake backend validation error') {
      setFieldError('password', 'Invalid credentials (use "password")')
    }
    return
  }
})
</script>

<template>
  <div
    class="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-hidden px-4"
  >
    <div
      class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4"
    >
      <NuxtLink
        class="text-muted-400 hover:text-primary-500 dark:text-muted-700 dark:hover:text-primary-500 transition-colors duration-300"
      >
        <!-- <TairoLogo class="size-10" /> -->
        <img :src="`${config.public.routePrefix}/img/logo-iac-40.jpg`" alt="Logo">
      </NuxtLink>
      <div>
        <BaseThemeToggle />
      </div>
    </div>
    <div class="flex w-full items-center justify-center">
      <div class="relative mx-auto w-full max-w-2xl">
        <!--Form-->
        <BaseCard shadow="flat" color="default">
          <div class="me-auto ms-auto mt-4 w-full">
            <form
              method="POST"
              action=""
              class="me-auto ms-auto mt-4 w-full max-w-md"
              novalidate
              @submit.prevent="onSubmit"
            >
              <div class="text-center">
                <BaseHeading
                  as="h2"
                  size="3xl"
                  weight="medium"
                >
                  Welcome back!
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mb-6">
                  Login sebagai Admin
                </BaseParagraph>
              </div>
              <div class="px-8 py-4">
                <div class="mb-4 space-y-4">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="username"
                  >
                    <BaseInput
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="username"
                      label="Username"
                      placeholder="Username"
                      :classes="{
                        input: 'h-12',
                      }"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>

                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="password"
                  >
                    <BaseInput
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="password"
                      label="Password"
                      placeholder="Password"
                      :classes="{
                        input: 'h-12',
                      }"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
                <!-- <div class="mb-6">
                  <div class="mt-6 flex items-center justify-between">
                    <Field
                      v-slot="{ field, handleChange, handleBlur }"
                      name="trustDevice"
                    >
                      <BaseCheckbox
                        :model-value="field.value"
                        :disabled="isSubmitting"
                        rounded="sm"
                        label="Trust this device for 60 days"
                        color="primary"
                        @update:model-value="handleChange"
                        @blur="handleBlur"
                      />
                    </Field>
                  </div>
                </div> -->
                <div class="mb-6">
                  <BaseButton
                    :disabled="isSubmitting"
                    :loading="isSubmitting"
                    type="submit"
                    color="primary"
                    class="!h-12 w-full"
                  >
                    Sign In
                  </BaseButton>
                </div>
                <!-- <div class="mb-6 grid gap-0 sm:grid-cols-3">
                  <hr
                    class="border-muted-200 dark:border-muted-700 mt-3 hidden border-t sm:block"
                  >
                  <span
                    class="bg-muted-100 dark:bg-muted-900 text-muted-400 relative top-0.5 text-center font-sans text-sm"
                  >
                    Or continue with
                  </span>
                  <hr
                    class="border-muted-200 dark:border-muted-700 mt-3 hidden border-t sm:block"
                  >
                </div>

                No account link
                <p
                  class="text-muted-400 mt-4 flex justify-between font-sans text-sm leading-5"
                >
                  <span>Don't have an account?</span>
                  <NuxtLink
                    to="/auth/signup-2"
                    class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
                  >
                    Sign Up
                  </NuxtLink>
                </p> -->
              </div>
            </form>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
