# Deploying Game2048V2 Contract

The new V2 contract adds on-chain game start functionality with payment.

## Changes in V2

- **`startGame()`**: Payable function that costs 0.01 CELO to start a game
- **`hasActiveGame()`**: Check if a player has an active game
- Prevents score submission without starting a game on-chain
- Contract owner can withdraw accumulated fees

## Deployment Steps

### 1. Compile the contract

```bash
npx hardhat compile
```

### 2. Deploy to Celo Mainnet

```bash
npx hardhat run scripts/deploy-v2.ts --network celo
```

### 3. Update the contract address

After deployment, update `lib/contract-abi.ts`:

```typescript
export const CONTRACT_ADDRESS = "0xYourNewContractAddress" as `0x${string}`;
```

### 4. Verify the contract (optional but recommended)

```bash
npx hardhat verify --network celo 0xYourNewContractAddress
```

## Deployment Script

Create `scripts/deploy-v2.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Game2048V2 contract...");

  const Game2048V2 = await ethers.getContractFactory("Game2048V2");
  const game = await Game2048V2.deploy();

  await game.waitForDeployment();
  const address = await game.getAddress();

  console.log("✅ Game2048V2 deployed to:", address);
  console.log("\nUpdate lib/contract-abi.ts with:");
  console.log(`export const CONTRACT_ADDRESS = "${address}" as \`0x\${string}\`;`);

  const gameFee = await game.GAME_FEE();
  console.log("\nGame fee:", ethers.formatEther(gameFee), "CELO (0.01)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Testing the Contract

After deployment, test with:

```bash
# Start a game (costs 0.01 CELO)
npx hardhat console --network celo
> const Game2048V2 = await ethers.getContractFactory("Game2048V2")
> const game = await Game2048V2.attach("0xYourContractAddress")
> await game.startGame({ value: ethers.parseEther("0.01") })

# Check active game
> await game.hasActiveGame("0xYourAddress")

# Submit score
> await game.submitScore(1024, false)
```

## Cost Breakdown

- **Deploy contract**: ~$0.50 USD in gas fees
- **Start game**: 0.01 CELO (~$0.01 USD) + gas (~$0.001)
- **Submit score**: Free (only gas ~$0.001)

## Migration from V1

The V1 contract will continue to work, but won't require payment to play. To migrate:

1. Deploy V2 contract
2. Update CONTRACT_ADDRESS in the code
3. Push to GitHub
4. Vercel will auto-deploy

Users will need to start new games with the payment requirement.
