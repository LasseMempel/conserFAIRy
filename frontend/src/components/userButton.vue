<template>
    <div  v-if="router.path !== '/login'">
        <!-- Not logged in: plain button, no dropdown -->
        <q-btn
            v-if="!authStore.isAuthenticated"
            size="md"
            color="secondary"
            :label="t('auth.login')"
            text-color="primary"
            to="/login"
            rounded
        />

        <!-- Logged in: dropdown with user info + logout -->
        <q-btn-dropdown
            v-else
            size="md"
            color="secondary"
            :label="getUserInitials(authStore.user?.first_name, authStore.user?.last_name)"
            text-color="primary"
            rounded
        >
            <div class="row no-wrap q-pa-md">
                <div class="column items-center" >
                    <div class="text-subtitle1 q-mt-md q-mb-xs">
                        {{ authStore.user?.first_name + ' ' + authStore.user?.last_name }}
                    </div>
                    <q-btn
                        color="secondary"
                        text-color="primary"
                        :label="t('auth.logout')"
                        rounded
                        size="sm"
                        v-close-popup
                        @click="handleLogout"
                    />
                </div>
            </div>
        </q-btn-dropdown>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth';
import { getUserInitials } from 'src/utils/userInitials';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRoute()
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
}
</script>