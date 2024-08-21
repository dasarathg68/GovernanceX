import { http, createConfig } from '@wagmi/vue'
import { sepolia } from '@wagmi/vue/chains'
import { metaMask, walletConnect } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask(), walletConnect({ projectId: '98ff8584ade069a1bb2f462dcc557865' })],
  transports: {
    [sepolia.id]: http()
  }
})
