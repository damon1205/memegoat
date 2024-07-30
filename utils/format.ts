import { cvValue } from "@/interface";
import { ClarityValue } from "@stacks/transactions";

export const formatNumber = ({ number }: { number: number }) => {
  const formatter = new Intl.NumberFormat();
  return formatter.format(number);
};

export const formatCVTypeNumber = (data: ClarityValue) => {
  return Number((data as unknown as cvValue).value);
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toUTCString();
};
