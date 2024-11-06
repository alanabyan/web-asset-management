import Image from "next/image";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export default function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="relative z-10 flex items-center justify-end bg-[#FFF] px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2 py-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="destructive"
          className="h-6 w-10 rounded-[5px] bg-merah-primary p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <Image
            src={"/arrowLeft.svg"}
            alt="Arrow Right"
            width={8}
            height={8}
            className="object-contain"
          />
        </Button>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="destructive"
            className="h-6 w-10 rounded-[5px] bg-merah-primary p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <Image
              src={"/arrowRight.svg"}
              alt="Arrow Right"
              width={8}
              height={8}
              className="object-contain"
            />
          </Button>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="destructive"
            className="h-6 w-10 rounded-[5px] bg-[#FFE9EF] p-0 hover:bg-[#FFE9EF]"
          >
            <Image              src={"/printer.svg"}
              alt="Printer"
              width={12}
              height={12}
              className="bg-white object-contain"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
