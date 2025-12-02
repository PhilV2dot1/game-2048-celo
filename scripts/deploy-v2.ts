import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Game2048V2 contract...");

  const Game2048V2 = await ethers.getContractFactory("Game2048V2");
  const game = await Game2048V2.deploy();

  await game.waitForDeployment();
  const address = await game.getAddress();

  console.log("✅ Game2048V2 deployed to:", address);
  console.log("\n📝 Next steps:");
  console.log("1. Update lib/contract-abi.ts with:");
  console.log(`   export const CONTRACT_ADDRESS = "${address}" as \`0x\${string}\`;`);
  console.log("\n2. Verify the contract:");
  console.log(`   npx hardhat verify --network celo ${address}`);

  const gameFee = await game.GAME_FEE();
  console.log("\n💰 Game fee:", ethers.formatEther(gameFee), "CELO");

  const [deployer] = await ethers.getSigners();
  console.log("👤 Contract owner:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
