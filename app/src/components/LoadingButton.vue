<template>
  <button class="btn" :class="`btn-${color}`">
    <span class="loading loading-spinner loading-sm"></span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  color: string
}>()
</script>
