"use client";

import * as React from "react";

import AssetActionDropdown from "@/components/containers/AssetActionDropdown";
import DeleteTableComponent from "@/data/Delete/DeleteComponent";
import ComponentEdit from "@/data/Update/ComponentEdit";

export type ComponentProps = {
  id: string;
  assetName: string;
  serial: string;
  category: string;
  total: string;
  assetImg: string;
};

interface DataTableRowActionsProps {
  row: { original: ComponentProps }; // Menggunakan tipe yang diekspor dari file columns
}

export default function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
  };

  const handleEditAsset = () => {
    setIsDialogOpen(true);
    setIsDropdownOpen(false);
  };

  const handleDeleteAsset = () => {
    setIsDrawerOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <AssetActionDropdown
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        onEdit={handleEditAsset}
        onDelete={handleDeleteAsset}
      />

      <ComponentEdit
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        assetID={row.original.id}
      />
      <DeleteTableComponent
        isOpen={isDrawerOpen}
        onClose={handleCloseDialog}
        assetID={row.original.id}
      />
    </>
  );
}
