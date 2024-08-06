<template>
  <!-- <header> -->
  <div class="navbar bg-base-100 rounded-lg w-full shadow-lg z-50 fixed">
    <div class="navbar-start">
      <div class="cursor-pointer btn-ghost text-lg" @click="navigateToLink('ballots')">
        GovernanceX
      </div>
    </div>
    <div class="navbar-end">
      <div class="dropdown w-48 rounded-full mr-12">
        <div tabindex="0" role="button" class="">
          <div class="btn w-full flex flex-row justify-between bg-base-primary">
            <img src="../assets/Ethereum.png" height="20" width="20" alt="Ethereum Icon" />
            <div class="text-xs flex" v-if="isFetching">
              <span class="loading loading-dots loading-xs" data-test="balance-loading"></span>
            </div>
            <div v-else>
              <span class="text-black font-bold font-mono"> {{ balance }}</span>
              <span class="ml-2 text-black font-bold font-mono text-xs">ETH</span>
            </div>
          </div>
        </div>
      </div>
      <div className="dropdown cursor-pointer">
        <div tabindex="0">
          Themes
          <span class="badge text-xs bg-blue-300">Try!</span>
        </div>

        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content z-[1] bg-base-100 rounded-box border-transparent bg-[rgba(0,0,0,0.2)] w-32 mt-8"
        >
          <li v-for="theme in themesAvailable" :key="theme">
            <div
              type="radio"
              name="dropdown"
              class="btn btn-sm btn-ghost"
              :aria-label="theme"
              :value="theme"
              @click="emits('themeChanged', theme)"
            >
              {{ theme }}
            </div>
          </li>
        </ul>
      </div>
      <button class="btn btn-ghost btn-circle" v-if="$route.path != '/login'">
        <div class="indicator">
          <IconBell />
          <span class="badge badge-xs badge-primary indicator-item"></span>
        </div>
      </button>
      <div class="dropdown dropdown-end" v-if="$route.path != '/login'">
        <IconAvatar :imgsrc="user && user.photoURL ? user.photoURL : null" />
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li>
            <a @click="() => emits('logout')">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- </header> -->
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import IconBell from '@/components/icons/IconBell.vue'
import IconAvatar from '@/components/icons/IconAvatar.vue'
import { useAuth } from '@/composables/useAuth'
import { ref, watch } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useAccount } from '@wagmi/vue'
import { useBalance } from '@wagmi/vue'

const account = useAccount()
const { data, isFetching } = useBalance({ address: account.address })

// const { isConnected, userAddress, connectWallet, signInWithEthereum } = useWallet()

const { user } = useAuth()

defineProps<{
  themesAvailable: string[]
}>()

const emits = defineEmits(['themeChanged', 'logout'])
const router = useRouter()

const navigateToLink = (id: string) => {
  router.push('/' + id)
}
const balance = ref<any>(0)

watch(data, (newData: any) => {
  balance.value = (parseFloat(newData.value) / 10 ** parseFloat(newData.decimals)).toFixed(4)
})
onMounted(async () => {})
</script>

<style scoped></style>
