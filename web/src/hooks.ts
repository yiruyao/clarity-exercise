import { useQuery } from "@tanstack/react-query";
import {FeedbackData, FeedbackGroup} from "../../shared/types.ts";

export function useFeedbackQuery(query: unknown) {
  const queryKey = ["query-data", query];
  return useQuery<{ data: FeedbackData }>({
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/query", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        method: "POST",
      });

      if (!res.ok) {
        throw new Error('Network response failed');
      }
      return res.json();
    },
    // The query key is used to cache responses and should represent
    // the parameters of the query.
    queryKey: queryKey,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useGroupsQuery(query: unknown) {
  const queryKey = ["groups-data", query];
  return useQuery<{ data: FeedbackGroup[] }>({
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/groups", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        method: "POST",
      });

      return res.json();
    },
    // The query key is used to cache responses and should represent
    // the parameters of the query.
    queryKey: queryKey,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
