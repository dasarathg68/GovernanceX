<template>
  <dialog
    id="my_modal_10"
    class="modal modal-bottom sm:modal-middle"
    :class="{ 'modal-open': showCreateProposalModal }"
  >
    <div class="modal-box">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="emits('toggleCreateProposalModal')"
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
                  v-model="candidate.name"
                  placeholder="Candidate Name"
                />
                |
                <input
                  type="text"
                  class="w-60"
                  v-model="candidate.candidateAddress"
                  placeholder="Address"
                />
              </label>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <IconPlus
              class="w-6 cursor-pointer"
              @click="
                () => newProposalInput.candidates.push({ name: '', candidateAddress: '', votes: 0 })
              "
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
          <!-- <LoadingButton v-if="isPending" color="primary min-w-28" /> -->

          <button class="btn btn-primary btn-md justify-center" @click="createProposal">
            Create Proposal
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import LoadingButton from '@/components/LoadingButton.vue'
import { ref, watch } from 'vue'

import IconError from '../icons/IconError.vue'
import IconPlus from '../icons/IconPlus.vue'
import { useAccount, useWriteContract } from '@wagmi/vue'
// import { writeContract } from '@wagmi/core'

import VOTING_ABI from '@/artifacts/abi/voting.json'
import { config } from '@/wagmi.config'

const { writeContract, error, isSuccess } = useWriteContract()

const emits = defineEmits(['toggleCreateProposalModal'])
const props = defineProps<{
  showCreateProposalModal: boolean
  contractAddress: any
}>()

const { address } = useAccount()

const newProposalInput = ref({
  id: 0,
  title: '',
  description: '',
  draftedBy: address.value,
  isElection: false,
  isActive: true,
  teamId: 0,
  votes: {
    yes: 0,
    no: 0,
    abstain: 0
  },
  candidates: [
    {
      name: '',
      candidateAddress: '',
      votes: 0
    }
  ],
  voters: [
    {
      name: 'Dasarath G',
      isEligible: true,
      isVoted: false,
      memberAddress: '0xaFeF48F7718c51fb7C6d1B314B3991D2e1d8421E'
    },
    {
      name: 'Herm',
      isEligible: true,
      isVoted: false,
      memberAddress: '0xc542BdA5EC1aC9b86fF470c04062D6a181e67928'
    }
  ]
})
const createProposal = async () => {
  try {
    console.log(JSON.stringify(newProposalInput.value))
    const result = writeContract({
      abi: VOTING_ABI,
      address: props.contractAddress,
      functionName: 'addProposal',
      args: [newProposalInput.value]
    })
    console.log(result)
  } catch (e) {
    console.log(e)
  }
}
watch(error, () => {
  console.log(error.value)
})
watch(isSuccess, () => {
  if (isSuccess.value) {
    emits('toggleCreateProposalModal')
  }
})
</script>
