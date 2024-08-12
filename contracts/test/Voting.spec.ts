import { ethers } from "hardhat";
import { expect } from "chai";
import { Voting } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Voting Contract", () => {
  let voting: Voting;
  let owner: SignerWithAddress;
  let member1: SignerWithAddress;
  let member2: SignerWithAddress;
  let member3: SignerWithAddress;
  let member4: SignerWithAddress;
  let member5: SignerWithAddress;
  let member6: SignerWithAddress;
  let notMember: SignerWithAddress;

  const candidates = [
    {
      name: "Candidate 1",
      candidateAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      votes: 0,
    },
    {
      name: "Candidate 2",
      candidateAddress: "0x92d402Df9C107a5d539Fd8A430AaC9e2d93C0221",
      votes: 0,
    },
  ];

  async function deployContracts() {
    const VotingFactory = await ethers.getContractFactory("Voting");
    voting = (await VotingFactory.deploy()) as Voting;
    await voting.waitForDeployment();
  }

  context("Deploying Voting Contract", () => {
    before(async () => {
      [owner, member1, member2, notMember, member3, member4, member5, member6] =
        await ethers.getSigners();
      await deployContracts();
    });

    describe("CRUD Members and Proposals", async () => {
      it("should add a proposal successfully", async () => {
        const proposal = {
          id: 0,
          title: "Proposal 1",
          description: "Description of Proposal 1",
          draftedBy: await owner.getAddress(),
          isElection: false,
          votes: { yes: 0, no: 0, abstain: 0 },
          candidates,
          isActive: true,
          teamId: 1,
          voters: [
            {
              name: "Member 1",
              memberAddress: await member1.getAddress(),
              isVoted: false,
              isEligible: true,
            },
            {
              name: "Member 2",
              memberAddress: await member2.getAddress(),
              isVoted: false,
              isEligible: true,
            },
            {
              name: "Member 3",
              memberAddress: await member3.getAddress(),
              isVoted: false,
              isEligible: true,
            },
            {
              name: "Member 4",
              memberAddress: await member4.getAddress(),
              isVoted: false,
              isEligible: true,
            },
            {
              name: "Member 5",
              memberAddress: await member5.getAddress(),
              isVoted: false,
              isEligible: true,
            },
            {
              name: "Member 6",
              memberAddress: await member6.getAddress(),
              isVoted: false,
              isEligible: true,
            },
          ],
        };

        await expect(voting.addProposal(proposal))
          .to.emit(voting, "ProposalAdded")
          .withArgs(0, proposal.title, proposal.description);
      });

      it("should return the proposal details", async () => {
        const proposal = await voting.proposalsById(0);
        expect(proposal.title).to.equal("Proposal 1");
      });
    });

    describe("Voting actions", () => {
      it("should vote on a directive proposal successfully", async () => {
        const votingAsMember1 = voting.connect(member1);

        await expect(votingAsMember1.voteDirective(0, 1))
          .to.emit(voting, "DirectiveVoted")
          .withArgs(await member1.getAddress(), 0, 1);

        const proposal = await voting.proposalsById(0);
        expect(proposal.votes.yes).to.equal(1);
      });

      it("should not allow a member to vote twice on a proposal", async () => {
        const votingAsMember1 = voting.connect(member1);
        await expect(votingAsMember1.voteDirective(0, 1)).to.be.revertedWith(
          "You have already voted"
        );
      });

      it("should vote on an election proposal successfully", async () => {
        const votingAsMember2 = voting.connect(member2);

        await expect(
          votingAsMember2.voteElection(0, candidates[1].candidateAddress)
        )
          .to.emit(voting, "ElectionVoted")
          .withArgs(
            await member2.getAddress(),
            0,
            candidates[1].candidateAddress
          );

        const proposal = await voting.getProposalById(0);
        // const proposals = await voting.proposalsById();
        console.log(proposal);
        const candidate: any = proposal.candidates.find(
          (c: any) => c.candidateAddress === candidates[1].candidateAddress
        );
        expect(candidate.votes).to.equal(1);
      });

      it("should conclude a proposal successfully", async () => {
        await expect(voting.concludeProposal(0))
          .to.emit(voting, "ProposalConcluded")
          .withArgs(0, false);

        const proposal = await voting.proposalsById(0);
        expect(proposal.isActive).to.be.false;
      });
    });
  });
});
