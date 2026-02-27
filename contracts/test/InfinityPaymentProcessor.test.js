const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InfinityPaymentProcessor", function () {
  let infinityPaymentProcessor;
  let tonToken;
  let owner;
  let user1;
  let user2;
  let superAdmin;

  beforeEach(async function () {
    [owner, user1, user2, superAdmin] = await ethers.getSigners();

    // Deploy mock TON token
    const MockTON = await ethers.getContractFactory("MockTON");
    tonToken = await MockTON.deploy();
    await tonToken.deployed();

    // Mint tokens to users
    await tonToken.mint(user1.address, ethers.utils.parseEther("1000"));
    await tonToken.mint(user2.address, ethers.utils.parseEther("1000"));

    // Deploy InfinityPaymentProcessor
    const InfinityPaymentProcessor = await ethers.getContractFactory("InfinityPaymentProcessor");
    infinityPaymentProcessor = await InfinityPaymentProcessor.deploy(
      tonToken.address,
      superAdmin.address
    );
    await infinityPaymentProcessor.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await infinityPaymentProcessor.owner()).to.equal(owner.address);
    });

    it("Should set the right super admin", async function () {
      expect(await infinityPaymentProcessor.superAdmin()).to.equal(superAdmin.address);
    });

    it("Should set the right TON token address", async function () {
      expect(await infinityPaymentProcessor.tonToken()).to.equal(tonToken.address);
    });

    it("Should have the correct platform fee", async function () {
      expect(await infinityPaymentProcessor.platformFeePercent()).to.equal(250); // 2.5%
    });
  });

  describe("Payment Processing", function () {
    it("Should process payment correctly", async function () {
      const paymentAmount = ethers.utils.parseEther("10");
      
      // Approve tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, paymentAmount);
      
      // Process payment
      await expect(infinityPaymentProcessor.processPayment(
        user1.address,
        paymentAmount,
        "test_payment"
      )).to.emit(infinityPaymentProcessor, "PaymentProcessed")
        .withArgs(user1.address, paymentAmount, ethers.utils.parseEther("0.25"), anyValue);
      
      // Check user balance
      const userStats = await infinityPaymentProcessor.getUserStats(user1.address);
      expect(userStats.balance).to.equal(ethers.utils.parseEther("9.75")); // 10 - 0.25 fee
      expect(userStats.totalPaidAmount).to.equal(paymentAmount);
    });

    it("Should fail with zero amount", async function () {
      await expect(infinityPaymentProcessor.processPayment(
        user1.address,
        0,
        "test_payment"
      )).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should fail with invalid user address", async function () {
      const paymentAmount = ethers.utils.parseEther("10");
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, paymentAmount);
      
      await expect(infinityPaymentProcessor.processPayment(
        ethers.constants.AddressZero,
        paymentAmount,
        "test_payment"
      )).to.be.revertedWith("Invalid user address");
    });
  });

  describe("Staking System", function () {
    it("Should allow staking tokens", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      
      // Approve tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, stakeAmount);
      
      // Stake tokens
      await expect(infinityPaymentProcessor.connect(user1).stakeTokens(stakeAmount))
        .to.emit(infinityPaymentProcessor, "StakingProcessed")
        .withArgs(user1.address, stakeAmount, true);
      
      // Check stake amount
      const userStats = await infinityPaymentProcessor.getUserStats(user1.address);
      expect(userStats.stakeAmount).to.equal(stakeAmount);
    });

    it("Should allow unstaking tokens", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      
      // Approve and stake tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, stakeAmount);
      await infinityPaymentProcessor.connect(user1).stakeTokens(stakeAmount);
      
      // Unstake tokens
      await expect(infinityPaymentProcessor.connect(user1).unstakeTokens(stakeAmount))
        .to.emit(infinityPaymentProcessor, "StakingProcessed")
        .withArgs(user1.address, stakeAmount, false);
      
      // Check stake amount
      const userStats = await infinityPaymentProcessor.getUserStats(user1.address);
      expect(userStats.stakeAmount).to.equal(0);
    });

    it("Should fail unstaking insufficient amount", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      const unstakeAmount = ethers.utils.parseEther("200");
      
      // Approve and stake tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, stakeAmount);
      await infinityPaymentProcessor.connect(user1).stakeTokens(stakeAmount);
      
      // Try to unstake more than staked
      await expect(infinityPaymentProcessor.connect(user1).unstakeTokens(unstakeAmount))
        .to.be.revertedWith("Insufficient staked amount");
    });
  });

  describe("Diamond Tier System", function () {
    it("Should upgrade to Bronze tier with 100 TON stake", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      
      // Approve and stake tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, stakeAmount);
      await infinityPaymentProcessor.connect(user1).stakeTokens(stakeAmount);
      
      // Check diamond tier
      const userStats = await infinityPaymentProcessor.getUserStats(user1.address);
      expect(userStats.diamondTier).to.equal(1); // Bronze
    });

    it("Should upgrade to Silver tier with 500 TON stake", async function () {
      const stakeAmount = ethers.utils.parseEther("500");
      
      // Approve and stake tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, stakeAmount);
      await infinityPaymentProcessor.connect(user1).stakeTokens(stakeAmount);
      
      // Check diamond tier
      const userStats = await infinityPaymentProcessor.getUserStats(user1.address);
      expect(userStats.diamondTier).to.equal(2); // Silver
    });

    it("Should get correct tier benefits", async function () {
      const stakeAmount = ethers.utils.parseEther("1000");
      
      // Approve and stake tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, stakeAmount);
      await infinityPaymentProcessor.connect(user1).stakeTokens(stakeAmount);
      
      // Get tier benefits
      const benefits = await infinityPaymentProcessor.getDiamondTierBenefits(user1.address);
      expect(benefits.tier).to.equal(3); // Gold
      expect(benefits.name).to.equal("Gold");
      expect(benefits.multiplier).to.equal(150); // 1.5x
      expect(benefits.cashback).to.equal(20); // 20%
    });
  });

  describe("Badge System", function () {
    it("Should unlock Pioneer badge with first payment", async function () {
      const paymentAmount = ethers.utils.parseEther("10");
      
      // Approve tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, paymentAmount);
      
      // Process payment
      await infinityPaymentProcessor.processPayment(
        user1.address,
        paymentAmount,
        "test_payment"
      );
      
      // Check badge count
      const userStats = await infinityPaymentProcessor.getUserStats(user1.address);
      expect(userStats.unlockedBadges).to.equal(0); // Pioneer requires 100 TON total
    });

    it("Should unlock Explorer badge with 500 TON total payments", async function () {
      const paymentAmount = ethers.utils.parseEther("500");
      
      // Approve tokens
      await tonToken.connect(user1).approve(infinityPaymentProcessor.address, paymentAmount);
      
      // Process payment
      await infinityPaymentProcessor.processPayment(
        user1.address,
        paymentAmount,
        "test_payment"
      );
      
      // Check badge count
      const userStats = await infinityPaymentProcessor.getUserStats(user1.address);
      expect(userStats.unlockedBadges).to.be.greaterThan(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update platform fee", async function () {
      await infinityPaymentProcessor.updatePlatformFee(500); // 5%
      expect(await infinityPaymentProcessor.platformFeePercent()).to.equal(500);
    });

    it("Should allow owner to update super admin", async function () {
      await infinityPaymentProcessor.updateSuperAdmin(user2.address);
      expect(await infinityPaymentProcessor.superAdmin()).to.equal(user2.address);
    });

    it("Should fail updating fee above 10%", async function () {
      await expect(infinityPaymentProcessor.updatePlatformFee(1500)) // 15%
        .to.be.revertedWith("Fee too high");
    });
  });
});
