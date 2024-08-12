<script setup lang="ts">
import CreateBallotCard from '@/components/CreateBallotCard.vue'
import { ref } from 'vue'

const showCreateBallotModal = ref<boolean>(false)
</script>

<template>
  <div class="mt-40">
    <CreateBallotCard
      :showCreateBallotModal="showCreateBallotModal"
      @toggleCreateBallotModal="() => (showCreateBallotModal = !showCreateBallotModal)"
    />
  </div>
</template>
