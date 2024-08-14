<template>
  <dialog
    id="my_modal_10"
    class="modal modal-bottom sm:modal-middle"
    :class="{ 'modal-open': showCreateProposalModal }"
  >
    <div class="modal-box">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="emits('toggleCreateBallotModal')"
      >
        ✕
      </button>
      <h2>Create Proposal</h2>
      <div class="flex flex-col gap-4 mt-2">
        <select class="select select-primary w-full" v-model="newProposalInput.isElection">
          <option disabled selected>Type of Proposal</option>
          <option :value="true">Election</option>
          <option :value="false">Directive</option>
        </select>
        <input
          type="text"
          placeholder="Title"
          class="input input-primary w-full"
          v-model="newProposalInput.title"
        />

        <textarea
          class="textarea textarea-primary h-24"
          placeholder="Description"
          v-model="newProposalInput.description"
        ></textarea>
        <div v-if="newProposalInput.isElection">
          <div
            class="flex text-sm gap-4 justify-between"
            v-for="(candidate, index) in newProposalInput.candidates"
            :key="index"
          >
            <div class="input-group mt-4">
              <label class="input input-primary flex items-center gap-2 input-md">
                <input
                  type="text"
                  class="grow"
                  v-model="searchUserName"
                  placeholder="Candidate Name"
                />
                |
                <input type="text" class="w-60" v-model="searchUserAddress" placeholder="Address" />
              </label>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <IconPlus
              class="w-6 cursor-pointer"
              @click="() => newProposalInput.candidates.push({ name: '', candidateAddress: '' })"
            />
            <IconError
              class="w-4 cursor-pointer"
              @click="
                () => {
                  if (newProposalInput.candidates.length - 1 > 0)
                    newProposalInput.candidates.splice(newProposalInput.candidates.length - 1, 1)
                }
              "
            />
          </div>
        </div>

        <div class="flex justify-center">
          <!-- <LoadingButton v-if="isLoading" color="primary min-w-28" /> -->

          <button class="btn btn-primary btn-md justify-center">Create Proposal</button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import LoadingButton from '@/components/LoadingButton.vue'
import { ref } from 'vue'

import IconError from '../icons/IconError.vue'
import IconPlus from '../icons/IconPlus.vue'

const emits = defineEmits(['toggleCreateProposalModal'])
const props = defineProps<{
  showCreateProposalModal: boolean
}>()

const searchUserName = ref('')
const searchUserAddress = ref('')

const newProposalInput = ref({
  title: '',
  description: '',
  candidates: [
    {
      name: '',
      candidateAddress: ''
    }
  ],
  isElection: false
})
</script>
