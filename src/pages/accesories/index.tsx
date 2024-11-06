"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "react-query";

import { DialogDemo } from "@/components/assets/ModalAccesories";
import { DataTable } from "@/components/containers/data-table";
import { AccesoriesBadge } from "@/components/laptop";
import Content from "@/components/layouts/Content";
import DashboardLayout from "@/components/layouts/LandingLayout";
import { microgen } from "@/lib/microgen";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const DataTableRowActions = dynamic(
  () => import("@/components/containers/accesories-row"),
);

export type AccesoriesProps = {
  id: string;
  assetName: string;
  category: string;
  total: string;
  checkedOutTo: string;
  checkInOut: string;
  assetImg: string;
};

// Columns Definition
const useColumns = (): ColumnDef<AccesoriesProps>[] => {
  return [
    {
      accessorKey: "id",
      header: () => <div className="">Asset Id</div>,
    },
    {
      accessorKey: "assetImg",
      header: () => (
        <div className="relative flex text-sm font-semibold text-black">
          Device Image
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center text-sm font-semibold text-black">
          <Image
            width={20}
            height={20}
            alt="Asset Gambar"
            src={row.getValue("assetImg")}
            className="h-[30px] w-[30px] cursor-pointer rounded-full"
          />
        </div>
      ),
    },
    {
      accessorKey: "assetName",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer items-center justify-between text-sm font-semibold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Asset Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer items-center justify-between text-sm font-semibold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Components Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer items-center justify-between text-sm font-semibold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "checkInOut",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer items-center justify-between text-sm font-semibold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Check In/Out
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "checkedOutTo",
      header: () => (
        <div className="text-sm font-semibold text-black">Checked Out To</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];
};

export default function DemoPage() {
  const router = useRouter();

  React.useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }
  }, []);

  const {
    data: dataAccesories,
    isLoading,
    refetch,
  } = useQuery(
    "get-accesories-table",
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const { data, error } = await microgen.service("Accessories").find({
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

  const data: AccesoriesProps[] = dataAccesories
    ? dataAccesories.map((asset) => ({
        id: asset?._id || "",
        assetName: asset?.name || "",
        category: asset?.category || "",
        total: asset?.total || 0,
        checkInOut: asset?.checkInOut || "",
        checkedOutTo:
          asset?.checkedOutTo && asset.checkedOutTo.length > 0
            ? asset.checkedOutTo[0].firstName
            : "-",
        assetImg:
          asset?.image && asset.image.length > 0 ? asset.image[0].url : "",
      }))
    : [
        {
          id: "",
          assetImg: "",
          assetName: "",
          category: "",
          total: 0,
          checkInOut: "",
          checkedOutTo: "-",
        },
      ];

  const [activeTab, setActiveTab] = React.useState("All Assets");

  const tabs = ["All Assets", "Ram", "Storage", "Other Spareparts"];

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex flex-row rounded-[20px] bg-white px-12 py-10 drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]">
        <AccesoriesBadge />
      </div>
      <div className="flex h-full flex-col justify-center rounded-[20px] bg-white px-3 pb-4 outline-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]">
        <header className="flex justify-between py-5">
          <ul className="flex gap-6">
            {tabs.map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer text-sm font-normal ${
                  activeTab === tab
                    ? "flex items-center rounded-[10px] bg-merah-primary px-4 py-1 text-white"
                    : "text-black/50"
                }`}
              >
                {tab}
              </li>
            ))}
          </ul>
          <DialogDemo refetch1={refetch} />
        </header>
        <div className={`${poppins.className} flex-grow overflow-y-visible`}>
          <div className="max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                Loading...
              </div>
            ) : (
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
