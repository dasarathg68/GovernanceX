import { ethers } from "hardhat";
import { expect, assert } from "chai";
import { Governor, MyToken } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Governor Contract", async () => {
  let governor: Governor;
  let myToken: MyToken;
  let owner: SignerWithAddress;
  let member1: SignerWithAddress;
  let member2: SignerWithAddress;

  [owner, member1, member2] = await ethers.getSigners();

  const MyTokenFactory = await ethers.getContractFactory("MyToken");
  myToken = (await MyTokenFactory.deploy(owner.getAddress())) as MyToken;
  myToken = await myToken.waitForDeployment();
  //   myToken.delegate(owner.getAddress());
  const GovernorFactory = await ethers.getContractFactory("MyGovernor");

  governor = await GovernorFactory.deploy(myToken, owner.getAddress());
  await governor.waitForDeployment();
  describe("Token actions", async () => {
    it("should provide the owner with a starting balance", async () => {
      const balance = await myToken.balanceOf(await owner.getAddress());
      assert.equal(balance.toString(), ethers.parseEther("10000").toString());
    });
  });
  describe("Governor actions", async () => {});
});
