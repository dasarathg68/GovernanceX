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
import LoadingButton from '@/components/LoadingButton.vue'
import { supabase } from '@/utils/supabase'
import { get } from 'node_modules/axios/index.cjs'

async function storeDeployedAddress() {
  try {
    await supabase
      .from('Contract')
      .insert([{ userAddress: currentAddress.value, deployedAddress: deployedAddress.value }])
  } catch (error) {
    show(ToastType.Error, 'Error storing contract address')
    console.error(error)
  }
}
async function getDeployedAddress() {
  const { data } = await supabase
    .from('Contract')
    .select('deployedAddress')
    .eq('userAddress', currentAddress.value)
  console.log(data)
}

const { show } = useToastStore()
const { address: currentAddress } = useAccount()

const deployedAddress = ref('')
const isCorrectChain = ref<boolean>(true)
const isDeploying = ref<boolean>(false)

const currentChain = useChainId()
const compatibleChainName = config.chains.find((chain) => chain.id == compatibleChain)?.name
console.log(compatibleChainName)

onMounted(async () => {
  await getDeployedAddress()
  if (currentChain.value != compatibleChain) {
    show(ToastType.Error, `Please switch to the ${compatibleChainName} network`)
    isCorrectChain.value = false
    return
  }
})
const showCreateBallotModal = ref<boolean>(false)
const deployBeaconProxy = async () => {
  try {
    isDeploying.value = true
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
    if (currentAddress.value) {
      nonce = await getTransactionCount(config, { address: currentAddress.value })
    }
    if (nonce && currentAddress.value) {
      deployedAddress.value = getContractAddress({
        from: currentAddress.value,
        nonce: BigInt(nonce)
      })
      console.log('deployedAddress', deployedAddress)
      await storeDeployedAddress()
      show(ToastType.Success, 'Contract deployed successfully')
      isDeploying.value = false
    }
    console.log('result', result)
  } catch (error) {
    console.error(error)
    isDeploying.value = false
    show(ToastType.Error, 'Error deploying contract')
  }
}
</script>

<template>
  <div class="mt-40" v-if="isCorrectChain">
    <CreateBallotCard
      :showCreateBallotModal="showCreateBallotModal"
      @toggleCreateBallotModal="() => (showCreateBallotModal = !showCreateBallotModal)"
    />
    <LoadingButton :color="'primary min-w-32 btn-sm'" v-if="isDeploying" />
    <button class="btn btn-sm btn-primary" @click="deployBeaconProxy" v-else>
      Deploy Contract
    </button>
  </div>
  <div class="flex mt-40 justify-center items-center" v-else>
    <p class="text-center text-lg">Please switch to the {{ compatibleChainName }} network</p>
  </div>
</template>
