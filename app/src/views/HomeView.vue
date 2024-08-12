<script setup lang="ts">
import CreateBallotCard from '@/components/CreateBallotCard.vue'
import { deployContract } from '@wagmi/core'
import VOTING_ABI from '@/artifacts/abi/voting.json'
import { BEACON_PROXY_BYTECODE } from '@/artifacts/bytecode/beacon-proxy'
import { config } from '@/wagmi.config'
import { chainId as compatibleChain } from '@/artifacts/constants'
import { useChainId } from '@wagmi/vue'
import { useToastStore } from '@/stores/toast'
import { onMounted, ref } from 'vue'
import { ToastType } from '@/types'

const { show } = useToastStore()

const isCorrectChain = ref<boolean>(true)

const currentChain = useChainId()
const compatibleChainName = config.chains.find((chain) => chain.id == compatibleChain)?.name
console.log(compatibleChainName)

onMounted(() => {
  if (currentChain.value != compatibleChain) {
    show(ToastType.Error, `Please switch to the ${compatibleChainName} network`)
    isCorrectChain.value = false
    return
  }
})
const showCreateBallotModal = ref<boolean>(false)
</script>

<template>
  <div class="mt-40" v-if="isCorrectChain">
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
  <div class="flex mt-40 justify-center items-center" v-else>
    <p class="text-center text-lg">Please switch to the {{ compatibleChainName }} network</p>
  </div>
</template>
