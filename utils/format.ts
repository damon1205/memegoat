import { cvValue } from "@/interface";
import { ClarityValue } from "@stacks/transactions";
import { splitToken } from "./helpers";
import { fetchCurrNoOfBlocks, userSession } from "./stacks.data";

export const formatNumber = (num: number | string) => {
  const formatter = new Intl.NumberFormat();
  return formatter.format(Number(num));
};

export const formatCVTypeNumber = (data: ClarityValue) => {
  if (!data) return 0;
  return Number((data as unknown as cvValue).value);
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toUTCString();
};

export const truncateTokenAddress = (address: string) => {
  const splits = splitToken(address);
  return `${splits[0].slice(0, 10)}...${splits[1]}`;
};

export const convertToIso = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString();
};

export const convertToBlocks = async (dateStr: string, currBlock: string) => {
  const now = Date.now() / 1000;
  const start = new Date(dateStr).getTime() / 1000;
  const dateInBlocks = (start - now) / 600;
  return Number(currBlock) + Number(dateInBlocks.toFixed(0));
};

export const splitColons = (pair: string) => {
  const data = pair.split("::");
  return data;
};
