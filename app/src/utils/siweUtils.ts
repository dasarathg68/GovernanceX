import {
  type SIWESession,
  type SIWEVerifyMessageArgs,
  type SIWECreateMessageArgs,
  createSIWEConfig,
  formatMessage
} from '@web3modal/siwe'
import { defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { mainnet, arbitrum, sepolia } from 'viem/chains'
// 1. Your WalletConnect Cloud project ID
const projectId = '98ff8584ade069a1bb2f462dcc557865'

// 2. Create a metadata object
const metadata = {
  name: 'NFT-Club-Member',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 3. Create wagmiConfig
const chains = [mainnet, arbitrum, sepolia]
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata
})

const BASE_URL = 'http://localhost:3000/api'

/* Function that returns the user's session - this should come from your SIWE backend */
async function getSession() {
  const res = await fetch(BASE_URL + '/session', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await res.json()
  return data == '{}' ? null : (data as SIWESession)
}

/* Use your SIWE server to verify if the message and the signature are valid */
const verifyMessage = async ({ message, signature }: SIWEVerifyMessageArgs) => {
  try {
    const response = await fetch(BASE_URL + '/verify', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({ message, signature }),
      credentials: 'include'
    })

    if (!response.ok) {
      return false
    }

    const result = await response.json()
    return result === true
  } catch (error) {
    return false
  }
}

// Check the full example for signOut and getNonce functions ...
const getNonce = async (): Promise<string> => {
  const res = await fetch(BASE_URL + '/nonce', {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const nonce = await res.text()
  console.log('Nonce:', nonce)
  return nonce
}
const signOut = async (): Promise<boolean> => {
  const res = await fetch(BASE_URL + '/signout', {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await res.json()
  return data == '{}'
}

/* Create a SIWE configuration object */
const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: [1, 2020],
    statement: 'Please sign with your account'
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) => formatMessage(args, address),
  getNonce,
  getSession,
  verifyMessage,
  signOut
})

export { config, siweConfig, projectId }
