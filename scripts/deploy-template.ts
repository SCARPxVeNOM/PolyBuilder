import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Get deployment account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");

  // Example: Deploy ERC-20 Token
  console.log("\nDeploying MyToken...");
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy("My Token", "MTK");
  await token.waitForDeployment();
  
  const tokenAddress = await token.getAddress();
  console.log("MyToken deployed to:", tokenAddress);

  // Save deployment info
  const deployment = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      MyToken: tokenAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n📝 Deployment Summary:");
  console.log(JSON.stringify(deployment, null, 2));

  console.log("\n✅ Deployment complete!");
  console.log("\n🔗 Next steps:");
  console.log(`1. Verify contract: npx hardhat verify --network ${deployment.network} ${tokenAddress} "My Token" "MTK"`);
  console.log(`2. View on Polygonscan: https://mumbai.polygonscan.com/address/${tokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

