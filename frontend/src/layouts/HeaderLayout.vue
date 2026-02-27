<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth';
import { getUserInitials } from 'src/utils/userInitials';
import { QMenu } from 'quasar';
import { ref } from 'vue';

const router = useRoute()
const authStore = useAuthStore();
const showUserMenu = ref(false);

function handleLogout() {
  authStore.logout();
  //router.push('/');
}
</script>

<template>
    <q-header elevated class="bg-primary text-secondary" >
      <q-toolbar> 
        <q-toolbar-title class="text-h5 text-bold text-center q-pt-sm">
          conserFAIRy
          <q-avatar size="50px">
            <img src="/icons/app_logo.png"/>
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs class="text-secondary float-left" v-if="router.path !== '/login'">
        <q-route-tab to="/" label="conserDUCTION" no-caps/>
        <q-route-tab to="/conserTABLE" label="conserTABLE" no-caps/>
        <q-route-tab to="/conserGRAPH" label="conserGRAPH" no-caps/>
      </q-tabs>
      <div class="float-right" v-if="router.path !== '/login'">
        <q-menu v-model="showUserMenu" anchor="bottom right" self="top right">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>User:</q-item-label>
                <q-item-label>{{ authStore.user?.first_name || authStore.user?.email }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        <q-avatar 
          v-if="authStore.isAuthenticated" 
          class="cursor-pointer"
          @click="showUserMenu = !showUserMenu"
          size="36px"
          color="accent"
          text-color="secondary"
        >
          {{ getUserInitials(authStore.user?.first_name, authStore.user?.last_name) }}
        </q-avatar>
        <q-btn 
          v-else 
          color="accent" 
          label="login" 
          text-color="secondary" 
          to="/login" 
          no-caps 
          flat 
        />
      </div>
    </q-header>
</template>
