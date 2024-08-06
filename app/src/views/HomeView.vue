<script setup lang="ts">
import { useAccount } from '@wagmi/vue'
import Account from '@/components/AccountComp.vue'
import Connect from '@/components/ConnectWallet.vue'
import { useSwitchChain } from '@wagmi/vue'

const { chains, switchChain } = useSwitchChain()

const { isConnected } = useAccount()
</script>

<template>
  <Account v-if="isConnected" />
  <Connect v-else />
  <div>
    <button v-for="chain in chains" :key="chain.id" @click="switchChain({ chainId: chain.id })">
      {{ chain.name }}
    </button>
  </div>
</template>
