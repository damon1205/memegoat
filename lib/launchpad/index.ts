import { queryOptions } from "@tanstack/react-query";

export const launchpadOptions = (id: string) =>
  queryOptions({
    queryKey: ["launchpad", id],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const response = await fetch(
        `https://api-socialfi.memegoat.io/campaign-requests/${id}`
      );

      return response.json();
    },
  });
