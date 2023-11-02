<template>
  <div>
      <button @click="decrement"> - </button>

      <span> Current value: {{ count }} </span>

      <button @click="increment"> + </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const decrement = () => {
  count.value--
}

const increment = () => {
  count.value++
}
</script>