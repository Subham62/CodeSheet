// ---------Next.js + Client Component + React Query (modern approach):
// --------Leveraging Suspense
// Next.js (App Router + tRPC + Server Components) approach is more powerful:

import { Suspense } from "react";
import { Client } from "./client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({text: "subham PREFETCH"}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
      <Client />
    </Suspense>
    </HydrationBoundary>
    
  );
};

export default Page;

// ---------Next.js with "Server Component" (no fetch needed)
// we're calling the tRPC router directly in a server component:

// import { caller } from "@/trpc/server";

// const Page = async () => {
//   const data = await caller.createAI({text: "Subham SERVER"});
//   return (
//       <div>
//         {JSON.stringify(data)}
//       </div>
    
//   );
// };

// export default Page;
// No HTTP request, no API endpoint. Just a direct server-side function call.
// -> Data fetched before rendering the server component
// when to use:->
// -> You just need to render static data on the server
// -> The component is not interactive


// Traditional React:

// -> Client always fetches data from server via APIs

// -> Requires serialization + more round-trips

// -> Separate frontend/backend code

// Next.js (App Router + tRPC + Server Components):

// -> Can fetch data directly on the server

// -> Data available immediately at render

// -> tRPC gives type-safe, API-less communication(Skipping unnecessary APIs)

// -> Suspense & Hydration improve UX and performance

// -> Client fetches only when needed