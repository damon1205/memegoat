import { cvValue } from "@/interface";
import { ClarityValue } from "@stacks/transactions";
import { splitToken } from "./helpers";
import { fetchCurrNoOfBlocks, userSession } from "./stacks.data";
import moment from "moment";

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

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 10)}...${address[address.length - 10]}`;
};

export const convertToIso = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString();
};

export const convertToBlocks = (dateStr: string, currBlock: string) => {
  const now = Date.now() / 1000;
  const start = new Date(dateStr).getTime() / 1000;
  const dateInBlocks = (start - now) / 600;
  return Number(currBlock) + Number(dateInBlocks.toFixed(0));
};

export const convertBlocksToDate = (block: number, currBlock: number) => {
  const now = Date.now();
  const timeDifference = Math.abs(block - currBlock) * 600 * 1000;
  const date = block > currBlock ? now + timeDifference : now - timeDifference;
  return new Date(date).toISOString();
};

export const splitColons = (pair: string) => {
  const data = pair.split("::");
  return data;
};

export const convertTime = (dateObj: Date) => {
  return moment(dateObj).format("LLLL");
};

export const formatBal = (bal: number | string) => {
  return Number(bal) / 1e6;
};
