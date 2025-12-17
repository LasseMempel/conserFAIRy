<template>

    <q-footer elevated class="bg-secondary text-white">
      <q-toolbar class="column">
        <div class="q-pt-sm row full-width no-wrap">
          <div class="q-pr-sm"> 
            Leibniz-Zentrum für Archäologie (LEIZA) 2025 
          </div>
          <q-separator color="white" vertical class=""/>
          <div class="q-pl-sm">
          Lasse Mempel-Länger
          </div>
        </div>
      
        <div class="row items-center" >
          <q-avatar size="70px">
            <img src="/icons/02_Weiss_Claim_kurz.svg"/>
          </q-avatar>
          <div class="row">
            <a href="https://www.leiza.de/impressum" target="_blank" class="text-white q-pa-sm">
              Impressum
            </a>
            <ContactComponent> </ContactComponent>
            <a href="https://www.leiza.de/datenschutz" target="_blank" class="text-white q-pa-sm">
              Datenschutz
            </a>
          </div>
          <div>
            LEIZA Department of Scientific IT
          </div>
        </div>
      </q-toolbar>
      
    </q-footer>
</template>

<script setup lang="ts">

import ContactComponent from 'src/components/contactComponent.vue';

</script>