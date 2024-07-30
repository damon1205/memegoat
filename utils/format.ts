import { cvValue } from "@/interface";
import { ClarityValue } from "@stacks/transactions";
import { splitToken } from "./helpers";

export const formatNumber = (num: number | string) => {
  const formatter = new Intl.NumberFormat();
  return formatter.format(Number(num));
};

export const formatCVTypeNumber = (data: ClarityValue) => {
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
