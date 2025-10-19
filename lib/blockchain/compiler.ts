import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export interface CompilationResult {
  success: boolean;
  artifacts?: any;
  errors?: string[];
  warnings?: string[];
}

export interface ContractFile {
  path: string;
  content: string;
}

/**
 * Compile Solidity contracts using Hardhat
 */
export async function compileContracts(
  files: ContractFile[],
  onLog?: (message: string) => void
): Promise<CompilationResult> {
  try {
    onLog?.("📝 Writing contract files...");

    // Create contracts directory if it doesn't exist
    const contractsDir = path.join(process.cwd(), "contracts");
    await fs.mkdir(contractsDir, { recursive: true });

    // Write all contract files
    for (const file of files) {
      const filePath = path.join(process.cwd(), file.path);
      const fileDir = path.dirname(filePath);
      await fs.mkdir(fileDir, { recursive: true });
      await fs.writeFile(filePath, file.content, "utf-8");
      onLog?.(`✓ Created ${file.path}`);
    }

    onLog?.("🔨 Compiling contracts with Hardhat...");

    // Run Hardhat compile
    const { stdout, stderr } = await execAsync("npx hardhat compile", {
      cwd: process.cwd(),
    });

    if (stderr && !stderr.includes("Warning")) {
      throw new Error(stderr);
    }

    onLog?.("✓ Compilation successful!");

    // Read compiled artifacts
    const artifactsDir = path.join(process.cwd(), "artifacts", "contracts");
    const artifacts: any = {};

    for (const file of files) {
      if (file.path.endsWith(".sol")) {
        const contractName = path.basename(file.path, ".sol");
        const artifactPath = path.join(
          artifactsDir,
          path.basename(file.path),
          `${contractName}.json`
        );

        try {
          const artifactContent = await fs.readFile(artifactPath, "utf-8");
          artifacts[contractName] = JSON.parse(artifactContent);
          onLog?.(`✓ Loaded artifact for ${contractName}`);
        } catch (error) {
          onLog?.(`⚠ Could not load artifact for ${contractName}`);
        }
      }
    }

    return {
      success: true,
      artifacts,
      warnings: stderr ? [stderr] : [],
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
}

/**
 * Clean up compiled artifacts
 */
export async function cleanArtifacts(): Promise<void> {
  const artifactsDir = path.join(process.cwd(), "artifacts");
  const cacheDir = path.join(process.cwd(), "cache");

  try {
    await fs.rm(artifactsDir, { recursive: true, force: true });
    await fs.rm(cacheDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors if directories don't exist
  }
}

