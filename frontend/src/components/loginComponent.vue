<template>
  <div class="fixed-center">
    <q-card style="width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="row items-center">
          <div class="col text-h6">{{ isLogin ? 'Login' : 'Register' }}</div>
          <div class="col-auto">
            <q-btn 
              flat 
              round 
              dense 
              icon="close" 
              @click="$router.back()"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            v-if="!isLogin"
            filled
            v-model="name"
            label="Your name *"
            hint="Full name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type your name']"
          />

          <q-input
            filled
            v-model="email"
            label="Email *"
            type="email"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please type your email',
              val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
            ]"
          />

          <q-input
            filled
            v-model="password"
            :label="isLogin ? 'Password *' : 'Password (min 6 characters) *'"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please type your password',
              val => val.length >= 6 || 'Password must be at least 6 characters'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input
            v-if="!isLogin"
            filled
            v-model="confirmPassword"
            label="Confirm Password *"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please confirm your password',
              val => val === password || 'Passwords do not match'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-toggle 
            v-if="!isLogin"
            v-model="accept" 
            label="I accept the terms and conditions" 
          />

          <div>
            <q-btn 
              :label="isLogin ? 'Login' : 'Register'" 
              type="submit" 
              color="primary"
              class="full-width"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center">
        <div class="text-body2">
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <a 
            href="#" 
            class="text-primary" 
            @click.prevent="toggleMode"
          >
            {{ isLogin ? 'Register' : 'Login' }}
          </a>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { AxiosError } from 'axios';

export default defineComponent({
  name: 'LoginPage',
  
  setup () {
    const $q = useQuasar();
    const router = useRouter();
    const authStore = useAuthStore();
    
    const isLogin = ref<boolean>(true);
    const name = ref<string | null>(null);
    const email = ref<string | null>(null);
    const password = ref<string | null>(null);
    const confirmPassword = ref<string | null>(null);
    const accept = ref<boolean>(false);
    const isPwd = ref<boolean>(true);

    const toggleMode = (): void => {
      isLogin.value = !isLogin.value;
      onReset();
    };

    const onSubmit = async (): Promise<void> => {
      if (!isLogin.value && accept.value !== true) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to accept the terms and conditions first'
        });
        return;
      }

      if (!email.value || !password.value) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Please fill in all required fields'
        });
        return;
      }

      try {
        if (isLogin.value) {
          // Login
          await authStore.login(email.value, password.value);
          
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'check_circle',
            message: `Welcome back, ${authStore.user?.email}!`
          });
          
          await router.push('/');
        } else {
          // Register
          await authStore.register(email.value, password.value);
          
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Registration successful! Please login.'
          });
          
          // Switch to login mode
          isLogin.value = true;
          password.value = null;
          confirmPassword.value = null;
        }
      } catch (error: unknown) {
        console.error('Auth error:', error);
        
        let errorMessage = 'An error occurred';
        
        if (error instanceof AxiosError) {
          if (error.response?.data?.detail) {
            if (typeof error.response.data.detail === 'string') {
              errorMessage = error.response.data.detail;
            } else {
              errorMessage = 'Invalid credentials';
            }
          } else if (error.response?.status === 400) {
            errorMessage = isLogin.value 
              ? 'Invalid email or password' 
              : 'Registration failed. Email may already be in use.';
          } else if (error.response?.status === 422) {
            errorMessage = 'Invalid input data';
          }
        }
        
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: errorMessage,
          timeout: 3000
        });
      }
    };

    const onReset = (): void => {
      name.value = null;
      email.value = null;
      password.value = null;
      confirmPassword.value = null;
      accept.value = false;
    };

    const goBack = (): void => {
      router.back();
    };

    return {
      isLogin,
      name,
      email,
      password,
      confirmPassword,
      accept,
      isPwd,
      loading: authStore.isLoading,
      toggleMode,
      onSubmit,
      onReset,
      goBack
    };
  }
});
</script>