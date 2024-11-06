import * as React from "react";
import dynamic from "next/dynamic";

import {
  AccesoriesBadge,
  ComputerBadge,
  LaptopLayouts,
  PeopleBadge,
} from "@/components/laptop";
import Content from "@/components/layouts/Content";
import DashboardLayout from "@/components/layouts/LandingLayout";

const DonutChart = dynamic(() => import("@/components/DonutChart"), {
  ssr: false,
});

const DemoPage = dynamic(() => import("./assets"), { ssr: false });
const People = dynamic(() => import("./people"), { ssr: false });

export default function Home() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="absolute left-0 top-16 ml-8">
        <span className="relative -top-12 text-2xl font-semibold">
          Dashboard
        </span>
        <div className="grid grid-cols-3 grid-rows-1 gap-72">
          <div className="h-[267px] w-[563px] rounded-[20px] bg-white px-6 py-3 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between">
              <span className="items-center text-xl font-semibold">Assets</span>
              <span className="text-[16px]">See All</span>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-x-44 gap-y-8 py-5">
              <LaptopLayouts />
              <PeopleBadge />
              <AccesoriesBadge />
              <ComputerBadge />
            </div>
          </div>
          <div className="h-[700px] w-[320px] rounded-[20px] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]">
            <DonutChart />
          </div>
          <div className="-ml-60 h-[267px] w-[563px] gap-[-200px] rounded-[20px] bg-white px-6 py-3 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]"></div>
        </div>
        <div className="absolute flex flex-row gap-x-[26.4rem]">
          <div className="scrollbar-hide no-scrollbar relative bottom-[20.6rem] h-[300px] w-[563px] overflow-y-scroll rounded-[20px] bg-white px-6 py-3 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]">
            <People />
          </div>
          <div className="no-scrollbar relative bottom-[21.1rem] h-[300px] w-[563px] overflow-y-scroll rounded-[20px] bg-white px-6 py-3 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]">
            <DemoPage />
          </div>
        </div>
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: any) {
  return (
    <DashboardLayout>
      <Content>{page}</Content>
    </DashboardLayout>
  );
};
