import * as React from "react";
import { useMutation } from "react-query";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { microgen } from "@/lib/microgen";

import { Button } from "../../components/ui/button";

interface DeleteTableProps {
  isOpen: boolean;
  onClose: () => void;
  assetID?: string;
}

export default function DeleteTableAccesories({
  isOpen,
  onClose,
  assetID,
}: DeleteTableProps) {
  const [selectedAssetId, setSelectedAssetId] = React.useState<string | null>(
    null,
  );
  const fetchAssetById = async (id: string) => {
    const { data, error } = await microgen.service("Accessories").getById(id);
    if (error) {
      console.error("Failed to fetch asset:", error);
      return;
    }
    return data;
  };

  React.useEffect(() => {
    if (isOpen && assetID) {
      setSelectedAssetId(assetID);
      fetchAssetById(assetID);
    }
  }, [isOpen, assetID]);

  const { mutate } = useMutation({
    mutationKey: ["delete-table"],
    mutationFn: async () => {
      if (!selectedAssetId) {
        throw new Error("Asset ID is required");
      }
      const { data, error } = await microgen
        .service("Accessories")
        .deleteById(selectedAssetId);
      if (error) throw new Error(error.message || "Failed to Delete asset");
      return data;
    },
    onSuccess: () => {
      console.log("Delete successful");
      window.location.reload();
    },
  });
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle>Are You Sure Want Delete Data?</DrawerTitle>
            <DrawerDescription className="text-red-400">
              Data will be permanently deleted
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              type="submit"
              onClick={() => {
                mutate();
              }}
              className="border border-black bg-transparent bg-merah-primary bg-clip-text text-transparent transition-all duration-1000 ease-out hover:border-none hover:bg-merah-primary hover:bg-clip-border hover:text-white"
            >
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="primary">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
