import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { NextPage } from "next";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarProvider from "@/providers/Sidebar";
import { cn } from "@/utils/shadcn";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Solivex</title>
        <meta
          name="description"
          content="Integrated Smart Solutions  or Modern Students, Optimizing Learning and Productivity with Cutting-edge Technology."
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <div
        className={cn(
          "min-h-screen bg-[#fafafd] bg-background font-sans antialiased",
        )}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <SidebarProvider>
              {getLayout(<Component {...pageProps} />)}
            </SidebarProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </div>
      <Toaster />
    </>
  );
}

export default App;
