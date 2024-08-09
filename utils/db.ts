import { TxData, TxRequest, TxType } from "@/interface";
import axios from "axios";
import { hashTransaction } from "./helpers";

export const storeTransaction = async (data: TxData) => {
  const hash = hashTransaction({ event: "transaction", data });
  try {
    const tx = await axios.post(
      "https://games-server.memegoat.io/webhook",
      { event: "transaction", data },
      {
        headers: {
          "x-webhook-signature": hash,
        },
      }
    );
    return tx;
  } catch (error) {
    console.error("Failed to store transaction:", error);
    throw error; // Rethrow to ensure error is not silently swallowed
  }
};

export const getRecentTransactions = async (data: TxRequest) => {
  const result = await axios.get(
    "https://games-server.memegoat.io/webhook/transactions",
    {
      params: data,
    }
  );
  return result.data.data as TxType[];
};

export async function getActiveUsers() {
  const result = await axios.get(
    "https://games-server.memegoat.io/webhook/uniqueAddresses"
  );

  return result.data.data as number;
}

export async function getTransactionCount() {
  const result = await axios.get(
    "https://games-server.memegoat.io/webhook/transactionCount"
  );

  return result.data.data as number;
}
