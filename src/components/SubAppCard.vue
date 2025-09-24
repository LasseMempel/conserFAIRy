<template>
    <q-card
    class="subAppCard"
    @click="$router.push(props.cardRoute)"
    >
      <img :src= "props.cardImage" />

      <q-card-section>
        <div class="text-h6"> {{ props.cardTitle }} </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ props.cardText }}
      </q-card-section>
    </q-card>
  </template>

<script setup lang="ts">

const props = defineProps({
  cardTitle: {
    type: String,
    required: true
  },

  cardText: {
    type: String,
    required: true
  },

  cardRoute: {
    type: String,
    required: true
  },

  cardImage: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
img {
    /* width: 100px; */
    height: 100px;
}

.subAppCard {
    height: 230px; 
    width: 170px;
}
</style>