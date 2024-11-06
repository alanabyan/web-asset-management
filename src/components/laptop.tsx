import Image from "next/image";
import { useQuery } from "react-query";



import { microgen } from "@/lib/microgen";





const AccesoriesBadge = () => {
  const { data: dataAccesories, isLoading } = useQuery(
    "get-accesories-assets",
    async () => {
      const { data } = await microgen
        .service("Accessories")
        .find({ lookup: { "*": "*" } });
      return data;
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const accesoriesCount = dataAccesories ? dataAccesories.length : 0;

  return (
    <div className="flex flex-row gap-7">
      <div className="flex h-16 w-20 items-center justify-center rounded-[20px] bg-merah-primary">
        <Image src={"accesories.svg"} width={50} height={50} alt="accesories" />
      </div>
      <div className="text-center">
        <span className="bg-merah-primary bg-clip-text text-xs font-medium text-transparent">
          Accesories
        </span>
        <div className="text-2xl font-semibold">
          {isLoading ? "..." : accesoriesCount}
        </div>
      </div>
    </div>
  );
};

const ComputerBadge = () => {
  const { data: dataComputer, isLoading } = useQuery({
    queryKey: ["get-computer"],
    queryFn: async () => {
      const { data } = await microgen
        .service("Assets")
        .find({ lookup: { "*": "*" } });
      return data;
    },
    refetchOnWindowFocus: false,
  });
  const ComputerCount = dataComputer
    ? dataComputer.filter((asset) => asset.category === "Computer").length
    : 0;

  return (
    <div className="flex flex-row gap-7">
      <div className="flex h-16 w-20 items-center justify-center rounded-[20px] bg-merah-primary">
        <Image src={"computer.svg"} width={50} height={50} alt="laptop" />
      </div>
      <div className="text-center">
        <span className="bg-merah-primary bg-clip-text text-xs font-medium text-transparent">
          Computer
        </span>
        <div className="text-2xl font-semibold">
          {isLoading ? "..." : ComputerCount}
        </div>
      </div>
    </div>
  );
};

const PeopleBadge = () => {
  const { data: dataUsers, isLoading } = useQuery(
    "get-people-users",
    async () => {
      const { data } = await microgen
        .service("Users")
        .find({ lookup: { "*": "*" } });
      return data;
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const peopleCount = dataUsers ? dataUsers.length : 0;

  return (
    <div className="flex flex-row gap-7">
      <div className="flex h-16 w-20 items-center justify-center rounded-[20px] bg-merah-primary">
        <Image src={"people.svg"} width={50} height={50} alt="laptop" />
      </div>
      <div className="text-center">
        <span className="bg-merah-primary bg-clip-text text-xs font-medium text-transparent">
          People
        </span>
        <div className="text-2xl font-semibold">
          {isLoading ? "..." : peopleCount}
        </div>
      </div>
    </div>
  );
};

const LaptopLayouts = () => {
  const { data: dataAssets, isLoading } = useQuery(
    "get-laptop-assets",
    async () => {
      const { data } = await microgen
        .service("Assets")
        .find({ lookup: { "*": "*" } });
      return data;
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const laptopCount =
    dataAssets?.filter((asset) => asset.model === "Laptop").length || 0;

  return (
    <div className="flex flex-row gap-7">
      <div className="flex h-16 w-20 items-center justify-center rounded-[20px] bg-merah-primary">
        <Image
          src="/vectorLaptop.svg"
          width={50}
          height={50}
          alt="Laptop icon"
        />
      </div>
      <div className="text-center">
        <span className="bg-merah-primary bg-clip-text text-xs font-medium text-transparent">
          Laptop
        </span>
        <div className="text-2xl font-semibold">
          {isLoading ? "..." : laptopCount}
        </div>
      </div>
    </div>
  );
};

export { LaptopLayouts, PeopleBadge, AccesoriesBadge, ComputerBadge };