"use client";

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "react-query";

import { DataTable } from "@/components/containers/data-table";
import { PeopleBadge } from "@/components/laptop";
import Content from "@/components/layouts/Content";
import DashboardLayout from "@/components/layouts/LandingLayout";
import { microgen } from "@/lib/microgen";

const ArrowUpDown = dynamic(
  () => import("lucide-react").then((mod) => mod.ArrowUpDown),
  {
    ssr: false,
  },
);

export type PeopleProps = {
  name: string;
  title: string;
  email: string;
  phone: string;
  userName: string;
  divisi: string;
};

export default function People() {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }
  }, []);

  const { data: dataUsers, isLoading } = useQuery(
    "get-users",
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const { data, error } = await microgen.service("Users").find({
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

  const data: PeopleProps[] = dataUsers
    ? dataUsers.map((user) => ({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        title: user.role,
        phone: user.phoneNumber,
        userName: user.firstName,
        divisi: user.division,
      }))
    : [
        {
          name: "",
          email: "",
          title: "",
          phone: "",
          userName: "",
          divisi: "",
        },
      ];

  const columns: ColumnDef<PeopleProps>[] = useMemo(
    () => [
      {
        accessorKey: "name",
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
        accessorKey: "title",
        header: ({ column }) => (
          <div
            className="flex cursor-pointer flex-row items-center justify-between text-sm font-semibold text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <div
            className="flex cursor-pointer flex-row items-center justify-between text-sm font-semibold text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <div
            className="flex cursor-pointer flex-row items-center justify-between text-sm font-semibold text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
      },
      {
        accessorKey: "userName",
        header: () => <div>Username</div>,
      },
      {
        accessorKey: "divisi",
        header: () => <div>Division</div>,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex flex-row rounded-[20px] bg-white px-12 py-10 drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]">
        <PeopleBadge />
      </div>
      <div className="flex h-full flex-col justify-center overflow-y-auto rounded-[20px] bg-white px-3 outline-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]">
        <header className="flex justify-between py-5">
          <ul className="flex gap-6">
            <li className="flex cursor-pointer items-center rounded-[10px] bg-merah-primary px-4 py-1 text-sm font-bold text-[#FFF]">
              All Consumable
            </li>
          </ul>
        </header>
        <div className="bg-[#FFF]">
          {!isLoading && <DataTable columns={columns} data={data} />}
        </div>
      </div>
    </div>
  );
}

People.getLayout = function getLayout(page: any) {
  return (
    <DashboardLayout>
      <Content>{page}</Content>
    </DashboardLayout>
  );
};
