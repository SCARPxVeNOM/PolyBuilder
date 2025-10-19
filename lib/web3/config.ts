import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon, polygonMumbai, polygonAmoy } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Polygon Scaffold Platform",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [polygonMumbai, polygonAmoy, polygon],
  ssr: true,
});

