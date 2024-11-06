"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useQuery } from "react-query";

import { DialogDemo } from "@/components/assets/ModalComponent";
import DataTableRowActions from "@/components/containers/component-row";
import { DataTable } from "@/components/containers/data-table";
import { LaptopLayouts } from "@/components/laptop";
import Content from "@/components/layouts/Content";
import DashboardLayout from "@/components/layouts/LandingLayout";
import { microgen } from "@/lib/microgen";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export type ComponentProps = {
  id: string;
  assetName: string;
  serial: string;
  category: string;
  total: string;
  assetImg: string;
};

function useColumns(): ColumnDef<ComponentProps>[] {
  return [
    {
      accessorKey: "assetName",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer flex-row items-center justify-between text-sm font-semibold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "assetImg",
      header: () => (
        <div className="relative right-7 flex text-sm font-semibold text-black">
          Asset Image
        </div>
      ),
      cell: ({ row }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedImage, setSelectedImage] = useState<string | null>(null);

        const handleImageClick = (imgUrl: string) => {
          setSelectedImage(imgUrl);
          setIsModalOpen(true);
        };

        const closeModal = () => {
          setIsModalOpen(false);
          setSelectedImage(null);
        };

        return (
          <>
            <div className="flex items-center text-sm font-semibold text-black">
              <Image
                width={20}
                height={20}
                alt="Asset Gambar"
                src={row.getValue("assetImg")}
                className="h-[30px] w-[30px] cursor-pointer rounded-full"
                onClick={() => handleImageClick(row.getValue("assetImg"))}
              />
            </div>
            {isModalOpen &&
              selectedImage &&
              createPortal(
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                  onClick={closeModal}
                >
                  <div className="relative rounded-lg bg-white p-4">
                    <Image
                      width={900}
                      height={900}
                      src={selectedImage}
                      alt="Asset Image"
                      className="h-auto max-w-full"
                    />
                  </div>
                </div>,
                document.body,
              )}
          </>
        );
      },
    },
    {
      accessorKey: "serial",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer flex-row items-center justify-between text-sm font-semibold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Serial
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer flex-row items-center justify-between text-sm font-semibold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer flex-row items-center justify-between text-sm font-semibold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];
}

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

      const { data, error } = await microgen.service("Component").find({
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

  const data: ComponentProps[] = dataAssets
    ? dataAssets.map((asset) => ({
        id: asset._id,
        assetName: asset.name,
        serial: asset.serial,
        category: asset.category,
        total: asset.total,
        assetImg: asset?.image?.length ? asset?.image[0].url : "",
      }))
    : [
        {
          id: "",
          assetImg: "",
          assetName: "",
          serial: "",
          category: "",
          total: "",
        },
      ];

  const [activeTab, setActiveTab] = useState("All Assets");

  const tabs = ["All Assets", "Laptop", "Workstation", "Other Assets"];

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex flex-row rounded-[20px] bg-white px-12 py-10 drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]">
        <LaptopLayouts />
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
