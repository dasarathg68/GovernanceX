<script setup lang="ts">
import { reconnect } from '@wagmi/core'
import { createWeb3Modal } from '@web3modal/wagmi/vue'

import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useThemeStore } from '@/stores/themes'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/composables/useAuth'
import { useToastStore } from '@/stores/toast'
import NotificationToast from '@/components/NotificationToast.vue'
import { projectId, config, siweConfig } from './utils/siweUtils'

import { ToastType } from '@/types/toast-type'
const toastStore = useToastStore()
const { showToast, type: toastType, message: toastMessage } = storeToRefs(toastStore)
const { currentTheme } = storeToRefs(useThemeStore())
const { show } = useToastStore()
const logout = () => {
  show(ToastType.Success, 'User Logged out successfully')
  useAuth().logout()
}

// 3. Create modal
reconnect(config)
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default,
  siweConfig
})
</script>

<template>
  <div class="flex flex-col min-h-svh justify-between" :data-theme="currentTheme">
    <NavBar
      :themesAvailable="useThemeStore().themes"
      @theme-changed="(newTheme) => useThemeStore().setTheme(newTheme)"
      @logout="logout"
    />

    <RouterView />
    <TheFooter />
    <NotificationToast v-if="showToast" :type="toastType" :message="toastMessage" />
  </div>
</template>
