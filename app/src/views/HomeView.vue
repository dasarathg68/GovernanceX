<script setup lang="ts">
import CreateBallotCard from '@/components/CreateBallotCard.vue'
import VOTING_ABI from '@/artifacts/abi/voting.json'
import { BEACON_PROXY_BYTECODE } from '@/artifacts/bytecode/beacon-proxy'
import { encodeFunctionData, getContractAddress } from 'viem'
import { deployContract, getTransactionCount } from '@wagmi/core'

import { config } from '@/wagmi.config'
import { chainId as compatibleChain, VOTING_BEACON_ADDRESS } from '@/artifacts/constants'
import BEACON_PROXY_ABI from '@/artifacts/abi/beacon-proxy.json'
import { useChainId, useAccount } from '@wagmi/vue'
import { useToastStore } from '@/stores/toast'
import { onMounted, ref } from 'vue'
import { ToastType } from '@/types'

const { show } = useToastStore()
const { address: currentAddress } = useAccount()

const deployedAddress = ref('')
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
        async () => {
          const encodedFunction = encodeFunctionData({
            abi: VOTING_ABI,
            functionName: 'initialize'
          })

          const result = await deployContract(config, {
            abi: BEACON_PROXY_ABI,
            bytecode: BEACON_PROXY_BYTECODE,
            args: [VOTING_BEACON_ADDRESS, encodedFunction]
          })
          let nonce
          if (currentAddress) {
            nonce = await getTransactionCount(config, { address: currentAddress })
          }
          if (nonce && currentAddress) {
            deployedAddress = getContractAddress({
              from: currentAddress,
              nonce: BigInt(nonce)
            })
            console.log('deployedAddress', deployedAddress)
          }
          console.log('result', result)
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
