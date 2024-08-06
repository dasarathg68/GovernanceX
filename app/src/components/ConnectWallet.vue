<script setup lang="ts">
import { useConnect, useChainId } from '@wagmi/vue'

const chainId = useChainId()
const { connectors, connect } = useConnect()
</script>

<template>
  <button
    v-for="(connector, index) in connectors"
    @click="connect({ connector, chainId })"
    :key="index"
  >
    {{ connector.name }}
  </button>
</template>
