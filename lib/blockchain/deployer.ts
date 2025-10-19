import { ethers } from "ethers";
import axios from "axios";

export interface DeploymentConfig {
  contractName: string;
  artifact: any;
  constructorArgs?: any[];
  network: "mumbai" | "amoy" | "polygon";
  privateKey: string;
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  gasUsed?: string;
  error?: string;
}

export interface VerificationResult {
  success: boolean;
  explorerUrl?: string;
  error?: string;
}

/**
 * Get RPC URL for network
 */
function getRpcUrl(network: string): string {
  const urls: Record<string, string> = {
    mumbai: process.env.POLYGON_MUMBAI_RPC || "https://rpc-mumbai.maticvigil.com",
    amoy: process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology",
    polygon: process.env.POLYGON_MAINNET_RPC || "https://polygon-rpc.com",
  };
  return urls[network] || urls.mumbai;
}

/**
 * Get explorer URL for network
 */
function getExplorerUrl(network: string): string {
  const urls: Record<string, string> = {
    mumbai: "https://mumbai.polygonscan.com",
    amoy: "https://amoy.polygonscan.com",
    polygon: "https://polygonscan.com",
  };
  return urls[network] || urls.mumbai;
}

/**
 * Deploy a smart contract
 */
export async function deployContract(
  config: DeploymentConfig,
  onLog?: (message: string) => void
): Promise<DeploymentResult> {
  try {
    onLog?.(`🚀 Deploying ${config.contractName} to ${config.network}...`);

    // Connect to network
    const provider = new ethers.JsonRpcProvider(getRpcUrl(config.network));
    const wallet = new ethers.Wallet(config.privateKey, provider);

    onLog?.(`📡 Connected to ${config.network}`);
    onLog?.(`👛 Deployer address: ${wallet.address}`);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    onLog?.(`💰 Balance: ${balanceInMatic} MATIC`);

    if (balance === BigInt(0)) {
      throw new Error("Insufficient balance for deployment. Please fund your wallet.");
    }

    // Create contract factory
    const factory = new ethers.ContractFactory(
      config.artifact.abi,
      config.artifact.bytecode,
      wallet
    );

    onLog?.("📝 Sending deployment transaction...");

    // Deploy contract
    const contract = await factory.deploy(...(config.constructorArgs || []));
    onLog?.(`⏳ Transaction sent: ${contract.deploymentTransaction()?.hash}`);

    // Wait for deployment
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    onLog?.(`✅ Contract deployed at: ${contractAddress}`);

    // Get deployment transaction receipt
    const deployTx = contract.deploymentTransaction();
    const receipt = deployTx ? await deployTx.wait() : null;

    const gasUsed = receipt ? receipt.gasUsed.toString() : "unknown";
    onLog?.(`⛽ Gas used: ${gasUsed}`);

    return {
      success: true,
      contractAddress,
      transactionHash: deployTx?.hash,
      gasUsed,
    };
  } catch (error: any) {
    onLog?.(`❌ Deployment failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify contract on Polygonscan
 */
export async function verifyContract(
  contractAddress: string,
  contractName: string,
  sourceCode: string,
  constructorArgs: any[],
  network: "mumbai" | "amoy" | "polygon",
  onLog?: (message: string) => void
): Promise<VerificationResult> {
  try {
    onLog?.("🔍 Verifying contract on Polygonscan...");

    const apiKey = process.env.POLYGONSCAN_API_KEY;
    if (!apiKey) {
      throw new Error("POLYGONSCAN_API_KEY not set");
    }

    const apiUrl =
      network === "polygon"
        ? "https://api.polygonscan.com/api"
        : network === "amoy"
        ? "https://api-amoy.polygonscan.com/api"
        : "https://api-testnet.polygonscan.com/api";

    // Encode constructor arguments
    const encodedArgs = constructorArgs.length > 0
      ? ethers.AbiCoder.defaultAbiCoder().encode(
          constructorArgs.map(() => "string"),
          constructorArgs
        ).slice(2)
      : "";

    const params = {
      apikey: apiKey,
      module: "contract",
      action: "verifysourcecode",
      contractaddress: contractAddress,
      sourceCode: sourceCode,
      codeformat: "solidity-single-file",
      contractname: contractName,
      compilerversion: "v0.8.20+commit.a1b79de6",
      optimizationUsed: "1",
      runs: "200",
      constructorArguements: encodedArgs,
    };

    onLog?.("📤 Submitting verification request...");

    const response = await axios.post(apiUrl, new URLSearchParams(params as any));

    if (response.data.status === "1") {
      const guid = response.data.result;
      onLog?.(`⏳ Verification GUID: ${guid}`);
      onLog?.("⏳ Waiting for verification (this may take a minute)...");

      // Poll for verification status
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

        const statusResponse = await axios.get(apiUrl, {
          params: {
            apikey: apiKey,
            module: "contract",
            action: "checkverifystatus",
            guid: guid,
          },
        });

        if (statusResponse.data.status === "1") {
          onLog?.("✅ Contract verified successfully!");
          const explorerUrl = `${getExplorerUrl(network)}/address/${contractAddress}#code`;
          onLog?.(`🔗 View on Polygonscan: ${explorerUrl}`);

          return {
            success: true,
            explorerUrl,
          };
        } else if (statusResponse.data.result === "Pending in queue") {
          attempts++;
          onLog?.(`⏳ Still pending... (${attempts}/${maxAttempts})`);
        } else {
          throw new Error(statusResponse.data.result);
        }
      }

      throw new Error("Verification timeout");
    } else {
      throw new Error(response.data.result);
    }
  } catch (error: any) {
    onLog?.(`❌ Verification failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get contract info from explorer
 */
export async function getContractInfo(
  contractAddress: string,
  network: "mumbai" | "amoy" | "polygon"
): Promise<any> {
  try {
    const apiKey = process.env.POLYGONSCAN_API_KEY;
    if (!apiKey) {
      throw new Error("POLYGONSCAN_API_KEY not set");
    }

    const apiUrl =
      network === "polygon"
        ? "https://api.polygonscan.com/api"
        : network === "amoy"
        ? "https://api-amoy.polygonscan.com/api"
        : "https://api-testnet.polygonscan.com/api";

    const response = await axios.get(apiUrl, {
      params: {
        module: "contract",
        action: "getsourcecode",
        address: contractAddress,
        apikey: apiKey,
      },
    });

    if (response.data.status === "1") {
      return response.data.result[0];
    }

    throw new Error(response.data.result);
  } catch (error: any) {
    throw new Error(`Failed to get contract info: ${error.message}`);
  }
}

