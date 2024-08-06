import { http, createConfig } from '@wagmi/vue'
import { mainnet, sepolia } from '@wagmi/vue/chains'
import { metaMask, walletConnect } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [metaMask(), walletConnect({ projectId: '98ff8584ade069a1bb2f462dcc557865' })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
})
