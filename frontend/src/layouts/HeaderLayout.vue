<template>
    <q-header elevated class="bg-primary text-secondary" >
      <q-toolbar> 
        <q-tabs class="text-secondary" v-if="router.path !== '/login'">
          <q-route-tab to="/" label="Introduction" no-caps/>
          <q-route-tab to="/voc" label="Vocabularies" no-caps/>
          <q-route-tab to="/doc" label="Documentation" no-caps/>
        </q-tabs>
        <q-toolbar-title class="text-h5 text-bold text-center q-pa-sm">
          <q-avatar size="50px">
            <img src="/icons/app_logo.png"/>
          </q-avatar>
          conserFAIRy
        </q-toolbar-title>
        <userButton class="q-pa-sm"> </userButton>
      </q-toolbar>

    </q-header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import userButton from 'src/components/userButton.vue';

const router = useRoute()

</script>