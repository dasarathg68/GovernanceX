<script setup lang="ts">
import { useAccount } from '@wagmi/vue'
import Account from '@/components/AccountComp.vue'
import Connect from '@/components/ConnectWallet.vue'

const { isConnected } = useAccount()
</script>

<template>
  <Account v-if="isConnected" />
  <Connect v-else />
</template>
