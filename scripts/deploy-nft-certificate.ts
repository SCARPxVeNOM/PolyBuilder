import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying PolyBuilder NFT Certificate Contract...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "POL\n");

  if (balance === 0n) {
    console.error("❌ Error: Deployer account has no POL tokens!");
    console.log("Get POL from: https://faucet.polygon.technology/");
    process.exit(1);
  }

  // Deploy NFT Certificate contract
  console.log("⏳ Deploying NFTCertificate contract...");
  const NFTCertificate = await ethers.getContractFactory("NFTCertificate");
  const nftCertificate = await NFTCertificate.deploy();

  await nftCertificate.waitForDeployment();
  const contractAddress = await nftCertificate.getAddress();

  console.log("✅ NFTCertificate deployed to:", contractAddress);
  console.log("🔗 View on Polygonscan:", `https://amoy.polygonscan.com/address/${contractAddress}\n`);

  // Wait for a few block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await nftCertificate.deploymentTransaction()?.wait(5);
  console.log("✅ Contract confirmed!\n");

  console.log("📋 Contract Details:");
  console.log("   Name: PolyBuilder Certificate");
  console.log("   Symbol: PBC");
  console.log("   Type: ERC-721 (Soulbound)");
  console.log("   Network: Polygon Amoy Testnet");
  console.log("   Owner:", deployer.address);
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60) + "\n");

  console.log("📝 Add these to your .env.local:");
  console.log(`NFT_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`NFT_MINTER_PRIVATE_KEY=${process.env.DEPLOYER_PRIVATE_KEY}`);
  console.log("\n" + "=".repeat(60));

  // Verify contract on Polygonscan (optional)
  if (process.env.POLYGONSCAN_API_KEY) {
    console.log("\n⏳ Waiting before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

    console.log("🔍 Verifying contract on Polygonscan...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ Contract is already verified!");
      } else {
        console.log("⚠️  Verification failed:", error.message);
        console.log("   You can verify manually at:");
        console.log(`   https://amoy.polygonscan.com/address/${contractAddress}#code`);
      }
    }
  } else {
    console.log("\n⚠️  POLYGONSCAN_API_KEY not set - skipping verification");
    console.log("   Add it to .env.local to enable auto-verification");
  }

  console.log("\n✨ Next Steps:");
  console.log("1. Add NFT_CONTRACT_ADDRESS to .env.local");
  console.log("2. Restart your dev server (npm run dev)");
  console.log("3. Users can now earn certificates!");
  console.log("4. Issue your first certificate at /api/nft/issue");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });

