import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";

export function useContractRead(
  address: Address | undefined,
  abi: any[],
  functionName: string,
  args?: any[]
) {
  return useReadContract({
    address,
    abi,
    functionName,
    args,
  });
}

export function useContractWrite() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    write: writeContract,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

