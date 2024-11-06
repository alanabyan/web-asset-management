import * as React from "react";
import Image from "next/image";
import { useMutation, useQuery } from "react-query";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { microgen } from "@/lib/microgen";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export interface ShadCNDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assetID?: string;
}

interface AssetCategory {
  name: string;
}

export function ShadCNDialog({ isOpen, onClose, assetID }: ShadCNDialogProps) {
  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [checkInOut, setCheckInOut] = React.useState("");
  const [checkedOutTo, setCheckedOutTo] = React.useState<[] | string[]>([]);
  const [model, setModel] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [isDeployed, setIsDeployed] = React.useState(false);
  const [image, setImage] = React.useState<
    { url: string; fileName: string }[] | null
  >(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [selectedAssetId, setSelectedAssetId] = React.useState<string | null>(
    null,
  );

  const fetchAssetById = async (id: string) => {
    const { data, error } = await microgen.service("Assets").getById(id);
    if (error) {
      console.error("Failed to fetch asset:", error);
      return;
    }

    setName(data.name);
    setModel(data.model);
    setCategory(data.category);
    setCheckInOut(data.checkInOut);
    setStatus(data.status);
    setLocation(data.location);
    setCost(data.cost);
    setIsDeployed(data.isDeployed);
    setImage(data.image);
  };

  React.useEffect(() => {
    if (isOpen && assetID) {
      setSelectedAssetId(assetID);
      fetchAssetById(assetID);
    }
  }, [isOpen, assetID]);

  const { data: dataUsers, isLoading } = useQuery({
    queryKey: ["get-assets-edit"],
    queryFn: async () => {
      const { data, error } = await microgen.service("Assets").find({
        lookup: { "*": "*" },
      });

      return data;
    },
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setName(`${data?.[0].name}`);
      setModel(`${data?.[0].model}`);
      setCategory(`${data?.[0].category}`);
      setCheckInOut(`${data?.[0].checkInOut}`);
      setStatus(`${data?.[0].status}`);
      setLocation(`${data?.[0].location}`);
      setCost(data?.[0].cost);
      setIsDeployed(data?.[0].isDeployed);
      setImage(data?.[0].image);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    mutate(file);
  };

  const { mutate } = useMutation({
    mutationKey: ["updateAssets"],
    mutationFn: async (file?: File) => {
      if (!selectedAssetId) {
        throw new Error("Asset ID is required");
      }

      const currentData = dataUsers;

      const updatedFields: Partial<{
        name: string;
        model: string;
        category: string;
        location: string;
        image: { url: string; fileName: string }[];
        cost: string;
        checkInOut: string;
        checkedOutTo: string[];
        isDeployed: boolean;
        status: string;
      }> = {};

      if (name && name !== currentData?.[0].name) {
        updatedFields.name = name;
      }

      if (model && model !== currentData?.[0].model) {
        updatedFields.model = model;
      }

      if (category && category !== currentData?.[0].category) {
        updatedFields.category = category;
      }

      if (status && status !== currentData?.[0].status) {
        updatedFields.status = status;
      }

      if (location && location !== currentData?.[0].location) {
        updatedFields.location = location;
      }

      if (cost && cost !== currentData?.[0].cost) {
        updatedFields.cost = cost;
      }

      if (checkInOut && checkInOut !== currentData?.[0].checkInOut) {
        updatedFields.checkInOut = checkInOut;
      }

      if (
        checkedOutTo.length > 0 &&
        checkedOutTo[0] !== currentData?.[0].checkedOutTo[0]
      ) {
        updatedFields.checkedOutTo = checkedOutTo;
      }

      updatedFields.isDeployed = isDeployed;

      if (file) {
        const response = await microgen.storage.upload(file);
        if (response?.data?.url && response?.data?.fileName) {
          updatedFields.image = [
            {
              url: response.data.url,
              fileName: response.data.fileName,
            },
          ];
        } else {
          throw new Error("Failed to get uploaded image URL or file name");
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        console.log("No changes detected. Nothing to update.");
        return;
      }

      console.log("Updated Fields before sending:", updatedFields);

      const { data, error } = await microgen
        .service("Assets")
        .updateById(selectedAssetId, updatedFields);
      if (error) throw new Error(error.message || "Failed to update asset");
      return data;
    },
    onSuccess: () => {
      console.log("Update successful");
      refetch();
      window.location.reload();
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const profileImageSrc = image?.[0]?.url || "/account.svg";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-30" />
        <DialogContent className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-[425px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className="mb-6 flex flex-col items-center">
                {image ? (
                  <Image
                    src={profileImageSrc || "/account.svg"}
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
                  {image && image.length > 0
                    ? image[0].fileName
                    : "No Image Uploaded"}
                </span>
                <Input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);

                      const imageUrl = URL.createObjectURL(selectedFile);
                      setImage([
                        { url: imageUrl, fileName: selectedFile.name },
                      ]);
                    }
                  }}
                />
                {image && (
                  <div className="mt-4 flex space-x-4">
                    <Button
                      type="button"
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
                      type="button"
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
                      <SelectValue
                        placeholder={category || "Select Category"}
                      />
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
                      <SelectValue
                        placeholder={checkInOut || "Select Check In Or Out"}
                      />
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
                      if (value !== "Ready To Deploy") {
                        setIsDeployed(false);
                      }
                      console.log("Selected Status:", value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={status || "Select Status"} />
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
                        defaultValue={
                          checkedOutTo.length > 0 ? checkedOutTo[0] : ""
                        }
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
              onClick={handleSubmit}
              className="gap-2 bg-merah-primary px-3"
            >
              <Image src={"/plus.svg"} width={10} height={10} alt="add asset" />
              <span className="font-light">Add Assets</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
