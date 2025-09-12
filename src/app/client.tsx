"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
  const trpc = useTRPC();
//   trpc.createAI.queryOptions({text: "hello"}); //  API call
  // const { data } = useQuery(trpc.createAI.queryOptions({ text: "Jhon" }));  //  fetch the data from server
  const { data } = useSuspenseQuery(
    trpc.createAI.queryOptions({ text: "subham PREFETCH" })
  );

  return (
    <div className="font-bold text-rose-500">
      {JSON.stringify(data)}
    </div>
  );
};