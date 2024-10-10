import React from "react";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const AllProviders = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
