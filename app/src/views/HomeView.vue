<script setup lang="ts">
import CreateBallotCard from '@/components/CreateBallotCard.vue'
import { deployContract } from '@wagmi/core'
import VOTING_ABI from '@/artifacts/abi/voting.json'
import { BEACON_PROXY_BYTECODE } from '@/artifacts/bytecode/beacon-proxy'
import { config } from '@/wagmi.config'

import { ref } from 'vue'

const showCreateBallotModal = ref<boolean>(false)
</script>

<template>
  <div class="mt-40">
    <CreateBallotCard
      :showCreateBallotModal="showCreateBallotModal"
      @toggleCreateBallotModal="() => (showCreateBallotModal = !showCreateBallotModal)"
    />
    <button
      class="btn btn-sm btn-primary"
      @click="
        () => {
          deployContract(config, {
            abi: VOTING_ABI,
            bytecode: BEACON_PROXY_BYTECODE
          })
        }
      "
    >
      Deploy Contract
    </button>
  </div>
</template>
