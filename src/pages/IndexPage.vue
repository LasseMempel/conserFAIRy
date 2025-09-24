<template>
  <q-page class="flex flex-center column"> <!-- class="flex flex-center" -->
    <div class ="flex flex-center column">
      <q-img
        src='../assets/FAIRification.png'
        style="width: 175px;"
      />
    </div>
    <q-separator />
    <div class="q-pa-md row items-start q-gutter-md">
      <SubAppCard
            v-for="subcard in subAppCardList"
            :key="subcard.cardTitle"
            v-bind="subcard"
          />
    </div>
  </q-page>
</template>

<script setup lang="ts">

  import SubAppCard from '../components/SubAppCard.vue'
  import imgCSV from '../assets/CSV-Image.svg'
  import imgRDF from '../assets/RDF-Image.svg'
  //import appLogo from '../assets/FAIRification.png'

  const subAppCardList = [
  {
    cardTitle: 'conserTABLE',
    cardText: 'FAIRifizierung tabellarischer Vokabulare',
    cardImage: imgCSV,
    cardRoute: '/conserTABLE'
  },
  {
    cardTitle: 'conserGRAPH',
    cardText: 'Ontologische Abbildung von Konservierungsdaten',
    cardImage: imgRDF,
    cardRoute: '/conserGRAPH'
  }
]

</script>

<style scoped>
  .sub-card {
  width: 100%;
  max-width: 250px;
  }
</style>
