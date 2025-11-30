import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Game2048 contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const Game2048 = await ethers.getContractFactory("Game2048");
  const game = await Game2048.deploy();

  await game.waitForDeployment();

  const address = await game.getAddress();
  console.log("✅ Game2048 deployed to:", address);
  console.log("\n📋 Next steps:");
  console.log("1. Update lib/contract-abi.ts with the contract address:");
  console.log(`   export const CONTRACT_ADDRESS = "${address}" as \`0x\${string}\`;`);
  console.log("\n2. Verify the contract (optional):");
  console.log(`   npx hardhat verify --network ${(await ethers.provider.getNetwork()).name} ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
