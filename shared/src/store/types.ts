import { BigNumber } from "ethers";

import { VaultOptions } from "../constants/constants";

export const AssetsList = [
  "AAVE",
  "AURORA",
  "WNEAR",
  "WAVAX",
  "WETH",
  "USDC",
  "WBTC",
  "stETH",
  "wstETH",
  "yvUSDC",
  "PERP",
  "RBN",
  "veRBN",
  "LDO",
  "SOL",
] as const;
export type Assets = typeof AssetsList[number];

export const WalletsList = [
  "Metamask",
  "WalletConnect",
  "WalletLink",
  "Phantom",
  "Solflare",
] as const;
export type Wallets = typeof WalletsList[number];

export type PendingTransaction = {
  txhash: string;
  status?: "success" | "error";
} & (
  | {
      type: "withdraw" | "withdrawInitiation" | "migrate";
      amount: string;
      vault: VaultOptions;
    }
  | {
      type: "deposit" | "approval";
      amount: string;
      vault: VaultOptions;
      asset: Assets;
    }
  | {
      type: "claim";
      amount: string;
    }
  | {
      type: "stakingApproval";
      amount: string;
      stakeAsset: VaultOptions;
    }
  | {
      type: "stake" | "unstake";
      amount: string;
      stakeAsset: VaultOptions;
    }
  | {
      type: "rewardClaim";
      amount: string;
      stakeAsset: VaultOptions;
    }
  | {
      type: "transfer";
      amount: string;
      transferVault: VaultOptions;
      receiveVault: VaultOptions;
    }
);

export type AirdropInfoData = {
  account: string;
  total: number;
  proof: {
    index: number;
    amount: BigNumber;
    proof: string[];
  };
  breakdown: {
    [key: string]: number;
  };
  claimed: boolean;
};
