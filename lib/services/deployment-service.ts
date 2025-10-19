import axios from "axios";

export interface DeploymentStatus {
  stage: "idle" | "compiling" | "deploying" | "verifying" | "completed" | "error";
  message: string;
  progress: number;
  contractAddress?: string;
  transactionHash?: string;
  explorerUrl?: string;
  gasUsed?: string;
  verified?: boolean;
}

export class DeploymentService {
  private onStatusChange?: (status: DeploymentStatus) => void;
  private onLog?: (log: string) => void;

  constructor(
    onStatusChange?: (status: DeploymentStatus) => void,
    onLog?: (log: string) => void
  ) {
    this.onStatusChange = onStatusChange;
    this.onLog = onLog;
  }

  private updateStatus(status: Partial<DeploymentStatus>) {
    const fullStatus: DeploymentStatus = {
      stage: status.stage || "idle",
      message: status.message || "",
      progress: status.progress || 0,
      ...status,
    };
    this.onStatusChange?.(fullStatus);
  }

  private log(message: string) {
    this.onLog?.(message);
  }

  async deployFullProject(params: {
    files: Array<{ path: string; content: string }>;
    mainContract: string;
    constructorArgs?: any[];
    network: "mumbai" | "amoy" | "polygon";
    autoVerify?: boolean;
  }): Promise<DeploymentStatus> {
    try {
      // Stage 1: Compilation
      this.updateStatus({
        stage: "compiling",
        message: "Compiling smart contracts...",
        progress: 10,
      });

      const compileResponse = await axios.post("/api/compile", {
        files: params.files,
      });

      if (!compileResponse.data.success) {
        throw new Error(compileResponse.data.errors?.join("\n") || "Compilation failed");
      }

      // Log compilation results
      compileResponse.data.logs?.forEach((log: string) => this.log(log));

      const artifacts = compileResponse.data.artifacts;
      const mainArtifact = artifacts[params.mainContract];

      if (!mainArtifact) {
        throw new Error(`Contract ${params.mainContract} not found in compilation output`);
      }

      this.updateStatus({
        stage: "compiling",
        message: "✓ Compilation successful",
        progress: 30,
      });

      // Stage 2: Deployment
      this.updateStatus({
        stage: "deploying",
        message: `Deploying to ${params.network} testnet...`,
        progress: 40,
      });

      const deployResponse = await axios.post("/api/deploy", {
        contractName: params.mainContract,
        artifact: mainArtifact,
        constructorArgs: params.constructorArgs || [],
        network: params.network,
      });

      if (!deployResponse.data.success) {
        throw new Error(deployResponse.data.error || "Deployment failed");
      }

      // Log deployment results
      deployResponse.data.logs?.forEach((log: string) => this.log(log));

      const { contractAddress, transactionHash, gasUsed } = deployResponse.data;

      this.updateStatus({
        stage: "deploying",
        message: "✓ Contract deployed successfully",
        progress: 70,
        contractAddress,
        transactionHash,
        gasUsed,
      });

      // Stage 3: Verification (if enabled)
      let explorerUrl = `https://${params.network === "mumbai" ? "mumbai." : params.network === "amoy" ? "amoy." : ""}polygonscan.com/address/${contractAddress}`;

      if (params.autoVerify) {
        this.updateStatus({
          stage: "verifying",
          message: "Verifying contract on Polygonscan...",
          progress: 75,
          contractAddress,
          transactionHash,
          gasUsed,
        });

        try {
          // Get the source code for the main contract
          const mainContractFile = params.files.find((f) =>
            f.path.includes(params.mainContract)
          );

          if (mainContractFile) {
            const verifyResponse = await axios.post("/api/verify", {
              contractAddress,
              contractName: params.mainContract,
              sourceCode: mainContractFile.content,
              constructorArgs: params.constructorArgs || [],
              network: params.network,
            });

            // Log verification results
            verifyResponse.data.logs?.forEach((log: string) => this.log(log));

            if (verifyResponse.data.success) {
              explorerUrl = verifyResponse.data.explorerUrl || explorerUrl;
              this.updateStatus({
                stage: "verifying",
                message: "✓ Contract verified on Polygonscan",
                progress: 95,
                contractAddress,
                transactionHash,
                gasUsed,
                explorerUrl,
                verified: true,
              });
            } else {
              this.log(`⚠ Verification failed: ${verifyResponse.data.error}`);
              this.log("Contract is deployed but not verified");
            }
          }
        } catch (verifyError: any) {
          this.log(`⚠ Verification error: ${verifyError.message}`);
          this.log("Contract is deployed but not verified");
        }
      }

      // Stage 4: Completed
      const finalStatus: DeploymentStatus = {
        stage: "completed",
        message: "🎉 Deployment completed successfully!",
        progress: 100,
        contractAddress,
        transactionHash,
        gasUsed,
        explorerUrl,
        verified: params.autoVerify,
      };

      this.updateStatus(finalStatus);
      return finalStatus;
    } catch (error: any) {
      const errorStatus: DeploymentStatus = {
        stage: "error",
        message: `❌ Error: ${error.message}`,
        progress: 0,
      };

      this.updateStatus(errorStatus);
      this.log(`❌ Deployment failed: ${error.message}`);

      return errorStatus;
    }
  }

  async quickDeploy(params: {
    template: string;
    network: "mumbai" | "amoy" | "polygon";
  }): Promise<DeploymentStatus> {
    // This would fetch template files and deploy
    // For now, return a placeholder
    this.log("Quick deploy feature coming soon!");
    return {
      stage: "idle",
      message: "Quick deploy not yet implemented",
      progress: 0,
    };
  }
}

