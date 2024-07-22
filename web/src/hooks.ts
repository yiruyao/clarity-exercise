import { useQuery } from "@tanstack/react-query";

type Feedback = {
  id: number;
  name: string;
  description: string;
  importance: "High" | "Medium" | "Low";
  type: "Sales" | "Customer" | "Research";
  customer: "Loom" | "Ramp" | "Brex" | "Vanta" | "Notion" | "Linear" | "OpenAI";
  date: string;
};

export type FeedbackData = Feedback[];

export type FeedbackGroup = {
  name: string;
  feedback: Feedback[];
};

export function useFeedbackQuery(query: unknown) {
  const queryKey = ["query-data", query]; // Construct the query key
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
    refetchOnWindowFocus: false, // Disable refetch on window focus to isolate the issue
    retry: 1,
  });
}

export function useGroupsQuery(query: unknown) {
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
    queryKey: ["groups-data"],
  });
}
