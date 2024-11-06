import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

import { DialogDemo } from "@/components/assets/Modal";
import { DataTable } from "@/components/containers/data-table";
import { ComputerBadge, LaptopLayouts } from "@/components/laptop";
import Content from "@/components/layouts/Content";
import DashboardLayout from "@/components/layouts/LandingLayout";
import { microgen } from "@/lib/microgen";
import { AssetProps, useColumns } from "@/components/containers/asset-row";


const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }
  }, []);

  const {
    data: dataAssets,
    isLoading,
    refetch,
  } = useQuery(
    "get-assets",
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const { data, error } = await microgen.service("Assets").find({
        lookup: { "*": "*" },
        limit: 10,
      });

      if (error) {
        throw new Error(error.message || "Failed to fetch assets");
      }

      return data;
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const data: AssetProps[] = dataAssets
    ? dataAssets.map((asset) => ({
        id: asset._id,
        assetName: asset.name,
        model: asset.model,
        category: asset.category,
        status: asset.status,
        CheckOut: asset.checkedOutTo.length
          ? asset.checkedOutTo[0].firstName
          : "-",
        isDeployed: asset.isDeployed,
        assetImg: asset?.image?.length ? asset?.image[0].url : "",
      }))
    : [
        {
          id: "",
          assetImg: "",
          assetName: "",
          category: "",
          CheckOut: "",
          isDeployed: false,
          model: "",
          status: "Pending",
        },
      ];

  const [activeTab, setActiveTab] = useState("All Assets");

  const tabs = ["All Assets", "Laptop", "Workstation", "Other Assets"];

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex flex-row gap-x-36 rounded-[20px] bg-white px-12 py-10 drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]">
        <LaptopLayouts />
        <ComputerBadge />
      </div>
      <div className="flex h-full flex-col justify-center overflow-y-auto rounded-[20px] bg-white px-3 outline-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]">
        <header className="flex justify-between py-5">
          <ul className="flex gap-6">
            {tabs.map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer text-sm font-normal text-[#000/50] ${
                  activeTab === tab
                    ? "flex items-center rounded-[10px] bg-merah-primary px-4 py-1 text-sm font-normal text-[#FFF]"
                    : ""
                }`}
              >
                {tab}
              </li>
            ))}
          </ul>
          <DialogDemo refetch1={refetch} />
        </header>
        <div className={`${poppins.className} bg-[#FFF]`}>
          {!isLoading && (
            <DataTable
              columns={useColumns()}
              data={data}
              loading={isLoading}
              emptyMessage="No records to display."
            />
          )}
        </div>
      </div>
    </div>
  );
}
DemoPage.getLayout = function getLayout(page: any) {
  return (
    <DashboardLayout>
      <Content>{page}</Content>
    </DashboardLayout>
  );
};
