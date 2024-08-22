<script setup>
import { ref } from 'vue'

const counter = ref(0)
</script>

<template>
  <div>
    <button @click="counter++">Count is: {{ counter }}</button>
  </div>
</template>
