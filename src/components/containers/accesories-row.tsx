"use client";

import * as React from "react";

import AssetActionDropdown from "@/components/containers/AssetActionDropdown";
import DeleteTable from "@/data/Delete/DeleteAsset";
import { AccesoriesEdit } from "@/data/Update/AccesoriesEdit";

import { AccesoriesProps } from "@/pages/accesories/index";

interface DataTableRowActionsProps {
  row: { original: AccesoriesProps };
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

      <AccesoriesEdit
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        assetID={row.original.id}
      />
      <DeleteTable
        isOpen={isDrawerOpen}
        onClose={handleCloseDialog}
        assetID={row.original.id}
      />
    </>
  );
}
