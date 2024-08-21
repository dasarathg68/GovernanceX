import { http, createConfig } from '@wagmi/vue'
import { mainnet, sepolia, base, polygon, arbitrum } from '@wagmi/vue/chains'
import { metaMask, walletConnect } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, base],
  connectors: [metaMask(), walletConnect({ projectId: '98ff8584ade069a1bb2f462dcc557865' })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http()
  }
})
