<template>
  <div class="fixed-full row justify-center items-center" style="overflow-y: auto; padding: 16px;">
    <q-card style="width: 400px; max-width: 90vw; max-height: 90vh; overflow-y: auto;">
      <q-card-section>
        <div class="row items-center">
          <div class="col text-h6">{{ isLogin ? t('auth.login') : t('auth.register') }}</div>
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

      <q-card-section class="q-pt-sm">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-sm"
        >
          <q-input
            v-if="!isLogin"
            filled
            v-model="firstName"
            :label="t('auth.firstName')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || t('auth.firstNameHint')]"
            dense 
          />

          <q-input
            v-if="!isLogin"
            filled
            v-model="lastName"
            :label="t('auth.lastName')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || t('auth.lastNameHint')]"
            dense 
          />

          <q-input
            filled
            v-model="email"
            :label="t('auth.email')"
            type="email"
            lazy-rules
            :rules="[val => val && val.length > 0 || t('auth.emailHint')]"
            dense 
          />

          <q-input
            filled
            v-model="password"
            :label="t('auth.password')"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || t('auth.passwordHint'),
              val => val.length >= 6 || t('auth.passwordLenghtHint')
            ]"
            dense 
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
            :label="t('auth.confirmPassword')"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || t('auth.confirmPasswordHint'),
              val => val === password || t('auth.confirmPasswordMatchHint')
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
            :label="t('auth.acceptTerms')" 
          />

          <div class="row q-gutter-sm">
            <q-btn 
              :label="isLogin ? t('auth.login') : t('auth.register')" 
              type="submit" 
              color="primary"
              class="col"
            />
            <q-btn
              :label="t('auth.reset')"
              type="reset"
              color="secondary"
              class="col"
            />

          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center">
        <div class="text-body2">
          {{ isLogin ? t('auth.noAccount') : t('auth.hasAccount') }}
          <a 
            href="#" 
            class="text-primary" 
            @click.prevent="toggleMode"
          >
            {{ isLogin ? t('auth.register') : t('auth.login') }}
          </a>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { Notify } from 'quasar';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth';
  import { AxiosError } from 'axios';
  import { useI18n } from 'vue-i18n'
  import { parseApiError } from 'src/utils/apiError';


  const { t } = useI18n()
  const router = useRouter();
  const authStore = useAuthStore();
  
  const isLogin = ref(true);
  const firstName = ref<string | null>(null);
  const lastName = ref<string | null>(null);
  const email = ref<string | null>(null);
  const password = ref<string | null>(null);
  const confirmPassword = ref<string | null>(null);
  const accept = ref(false);
  const isPwd = ref(true);

  const toggleMode = (): void => {
    isLogin.value = !isLogin.value;
    onReset();
  };

  const onSubmit = async (): Promise<void> => {
    if (!isLogin.value && accept.value !== true) {
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: t('auth.acceptTermHint')
      });
      return;
    }

    if (!email.value || !password.value) {
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: t('auth.missingFields')
      });
      return;
    }

    try {
      if (isLogin.value) {
        // Login
        await authStore.login(email.value, password.value);
        
        Notify.create({
          color: 'green-4',
          textColor: 'white',
          icon: 'check_circle',
          message: `${t('auth.welcome')}, ${authStore.user?.first_name}!`
        });
        
        router.back();
      } else {
        // Register
        await authStore.register(email.value, password.value, firstName.value!, lastName.value!);
        
        Notify.create({
          color: 'green-4',
          textColor: 'white',
          icon: 'check_circle',
          message: t('auth.registrationSuccessful')
        });
        
        // Switch to login mode
        isLogin.value = true;
        password.value = null;
        confirmPassword.value = null;
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);
      const errorMessage = parseApiError(error, isLogin.value ? 'login' : 'register');
      
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'error',
        message: errorMessage,
        timeout: 3000
      });
    }
  };

  const onReset = (): void => {
    firstName.value = null;
    lastName.value = null;
    email.value = null;
    password.value = null;
    confirmPassword.value = null;
    accept.value = false;
  };

</script>
