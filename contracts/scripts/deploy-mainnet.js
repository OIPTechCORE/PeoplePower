const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Infinity Payment Processor to MAINNET...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()));
  
  // Deploy the contract
  const InfinityPaymentProcessor = await ethers.getContractFactory("InfinityPaymentProcessor");
  
  // Replace with actual TON token address when available
  const TON_TOKEN_ADDRESS = process.env.TON_TOKEN_ADDRESS || "0x1234567890123456789012345678901234567890"; // Placeholder
  const SUPER_ADMIN_ADDRESS = process.env.SUPER_ADMIN_ADDRESS || deployer.address;
  
  console.log("🔗 Deploying with TON token address:", TON_TOKEN_ADDRESS);
  console.log("👤 Super admin address:", SUPER_ADMIN_ADDRESS);
  
  const infinityPaymentProcessor = await InfinityPaymentProcessor.deploy(
    TON_TOKEN_ADDRESS,
    SUPER_ADMIN_ADDRESS
  );
  
  await infinityPaymentProcessor.deployed();
  
  console.log("✅ InfinityPaymentProcessor deployed to:", infinityPaymentProcessor.address);
  console.log("📊 Transaction hash:", infinityPaymentProcessor.deployTransaction.hash);
  
  // Verify deployment
  const owner = await infinityPaymentProcessor.owner();
  const superAdmin = await infinityPaymentProcessor.superAdmin();
  
  console.log("🔍 Verification:");
  console.log("  - Contract owner:", owner);
  console.log("  - Super admin:", superAdmin);
  console.log("  - Platform fee:", await infinityPaymentProcessor.platformFeePercent());
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: infinityPaymentProcessor.address,
    deployer: deployer.address,
    superAdmin: SUPER_ADMIN_ADDRESS,
    tonTokenAddress: TON_TOKEN_ADDRESS,
    deploymentHash: infinityPaymentProcessor.deployTransaction.hash,
    deployedAt: new Date().toISOString()
  };
  
  console.log("💾 Deployment info saved:", JSON.stringify(deploymentInfo, null, 2));
  
  return infinityPaymentProcessor;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
