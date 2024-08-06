import { ref } from 'vue'
import { auth } from '@/config/firebaseConfig'
import router from '@/router'

import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth'
const isAuthenticated = ref(Boolean(localStorage.getItem('isAuthenticated') || false))
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
export function useAuth() {
  async function signup(email: string, password: string) {
    const user = await createUserWithEmailAndPassword(auth, email, password)
    if (user) {
      console.log('User created')
    } else {
      throw new Error('User not created')
    }
  }
  const signInWithEthereum = async () => {}
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const user1 = await signInWithPopup(auth, provider)
    if (user1) {
      console.log('User logged in')
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user1.user))
      isAuthenticated.value = true
      user.value = user1.user
      router.push('/ballots')
    } else {
      throw new Error('User not found')
    }
  }

  async function loginWithEmail(email: string, password: string) {
    const user = await signInWithEmailAndPassword(auth, email, password)
    if (user) {
      console.log('User logged in')
      localStorage.setItem('isAuthenticated', 'true')
      isAuthenticated.value = true

      router.push('/ballots')
    } else {
      throw new Error('User not found')
    }
  }

  async function logout() {
    await signOut(auth)
    isAuthenticated.value = false
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    user.value = {}
    console.log(user.value)
    router.push('/login')
    console.log('User logged out')
  }

  async function forgotPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
    console.log('Password reset email sent')
  }

  return {
    isAuthenticated,
    user,
    signup,
    loginWithGoogle,
    loginWithEmail,
    logout,
    forgotPassword,
    signInWithEthereum
  }
}
