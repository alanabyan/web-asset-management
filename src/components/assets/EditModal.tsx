import * as React from "react";
import Image from "next/image";
import { useMutation, useQuery } from "react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { microgen } from "@/lib/microgen";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DialogProps {
  refetch1: () => void;
}

interface AssetCategory {
  name: string;
}

export function DialogDemo({ refetch1 }: DialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [checkInOut, setCheckInOut] = React.useState("");
  const [checkedOutTo, setCheckedOutTo] = React.useState<[] | string[]>([]);
  const [model, setModel] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [isDeployed, setIsDeployed] = React.useState(false);
  const [image, setImage] = React.useState<{
    url: string;
    fileName: string;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://database-query.v3.microgen.id/api/v1/3ffcee30-cf9c-4cd1-8abd-086653de316d/storage/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      setImage({
        url: data?.url,
        fileName: file.name,
      });
    } catch (error) {
      console.error("Image Upload Error:", error);
    }
  };

  const { mutate } = useMutation({
    mutationKey: ["postAssets"],
    mutationFn: async () => {
      if (
        !name ||
        !status ||
        !model ||
        !category ||
        !checkInOut ||
        !location ||
        !cost ||
        !image
      ) {
        console.error("Missing required fields");
        return;
      }

      try {
        const payload = {
          name,
          status,
          category,
          checkInOut,
          checkedOutTo,
          cost: parseFloat(cost),
          isDeployed: isDeployed || false,
          location,
          model,
          image: [{ url: image?.url, fileName: image?.fileName }],
        };

        const { data, error } = await microgen
          .service("Assets")
          .create(payload);
        if (error) {
          throw new Error(error.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    },
    onError: (err) => {
      console.log("Mutation error:", err);
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
    },
  });

  const { data: dataCategory, refetch } = useQuery(
    "get-category",
    async () => {
      const { data, error } = await microgen.service("CategoryAssets").find({
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

  const data: AssetCategory[] = dataCategory
    ? dataCategory.map((categoryAsset) => ({
        name: categoryAsset.name,
      }))
    : [
        {
          name: "",
        },
      ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-8 gap-2 bg-merah-primary px-3"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Image src={"/plus.svg"} width={10} height={10} alt="add asset" />
          <span className="font-light">Add Asset</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Asset</DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate();
            }}
          >
            <div className="mb-6 flex flex-col items-center">
              {image ? (
                <Image
                  src={image.url}
                  alt="asset image"
                  width={180}
                  height={150}
                  className="cursor-pointer"
                />
              ) : (
                <Image
                  src={"/emptyImage.svg"}
                  alt="Asset Image"
                  width={180}
                  height={150}
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                />
              )}
              <span className="mt-2 text-gray-600">
                {image ? image.fileName : "No Image Uploaded"}
              </span>
              <Input
                type="file"
                accept="image/*"
                id="imageUpload"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              {image && (
                <div className="mt-4 flex space-x-4">
                  <Button
                    onClick={() => setImage(null)}
                    variant={"delete"}
                    className="flex justify-center gap-1.5 rounded-md px-4 py-2 text-red-500"
                  >
                    <Image
                      src={"/trash.svg"}
                      width={100}
                      height={100}
                      alt="Delete"
                      className="flex h-3.5 w-3.5"
                    />
                    <span className="bg-merah-primary bg-clip-text text-xs font-normal">
                      Delete Image
                    </span>
                  </Button>
                  <Button
                    className="flex items-center gap-1.5 rounded-md bg-merah-primary px-4 py-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image
                      src={"/Save.svg"}
                      width={100}
                      height={100}
                      alt="Change"
                      className="h-3.5 w-3.5"
                    />
                    <span className="text-xs font-normal">Change Image</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="asset-tag" className="text-right">
                  Asset Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="model" className="text-right">
                  Model
                </Label>
                <Input
                  id="model"
                  className="col-span-3"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="location" className="text-right">
                  Category
                </Label>
                <Select
                  onValueChange={(value: string) => {
                    setCategory(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {data.map((categoryAsset) => (
                        <SelectItem
                          key={categoryAsset.name}
                          value={categoryAsset.name}
                          className="font-semibold text-black transition-all duration-150 ease-linear hover:text-white"
                        >
                          {categoryAsset.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="location" className="text-right">
                  Checked In Out
                </Label>
                <Select
                  onValueChange={(value: string) => {
                    setCheckInOut(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Check In Or Out" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        value="checkin"
                        className="font-semibold text-black transition-all duration-150 ease-linear hover:text-white"
                      >
                        Check In
                      </SelectItem>
                      <SelectItem
                        value="checkout"
                        className="font-semibold text-black transition-all duration-100 ease-linear hover:text-white"
                      >
                        Check Out
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={(value: string) => {
                    setStatus(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectGroup>
                      <SelectItem
                        value="Ready To Deploy"
                        className="font-semibold text-black transition-all duration-150 ease-linear hover:text-white"
                      >
                        Ready To Deploy
                      </SelectItem>
                      <SelectItem
                        value="Archived"
                        className="font-semibold text-black transition-all duration-100 ease-linear hover:text-white"
                      >
                        Archived
                      </SelectItem>
                      <SelectItem
                        value="Lost"
                        className="font-semibold text-black transition-all duration-150 ease-linear hover:text-white"
                      >
                        Lost
                      </SelectItem>
                      <SelectItem
                        value="Broken"
                        className="font-semibold text-black transition-all duration-150 ease-linear hover:text-white"
                      >
                        Broken
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="asset-tag" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  className="col-span-3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="asset-tag" className="text-right">
                  Cost
                </Label>
                <Input
                  id="cost"
                  className="col-span-3"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="checkedOutTo" className="text-right">
                  Checked Out To
                </Label>
                <Select
                  disabled={checkInOut !== "checkout"}
                  onValueChange={(value) => setCheckedOutTo([value])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select Person/Entity"
                      defaultValue={checkedOutTo[0] || ""}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="-">-</SelectItem>
                      <SelectItem value="6704d327468ef0a5daf88e6a">
                        dyo
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="isDeployed"
                  disabled={status !== "Ready To Deploy"}
                  checked={isDeployed}
                  onChange={() => setIsDeployed((prev) => !prev)}
                />
                <Label
                  htmlFor="isDeployed"
                  className="flex items-center text-center"
                >
                  isDeployed
                </Label>
              </div>
            </div>
          </form>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              mutate();
              window.location.reload();
            }}
            className="gap-2 bg-merah-primary px-3"
          >
            <Image src={"/plus.svg"} width={10} height={10} alt="add asset" />
            <span className="font-light">Add Assets</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
