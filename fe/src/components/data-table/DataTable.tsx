import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/shadcn/button";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  /** When set, the table paginates client-side with this many rows per page. */
  pageSize?: number;
};

export function DataTable<TData>({
  data,
  columns,
  pageSize,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const paginated = pageSize !== undefined;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(paginated
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageIndex: 0, pageSize } },
        }
      : {}),
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const totalRows = table.getRowModel().rows.length
    ? data.length
    : 0;

  return (
    <div className="mx-auto grid w-full max-w-[65vw] gap-4">
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-4 px-6 text-xl font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 px-6 text-center text-xl text-muted-foreground"
                >
                  {t("admin.noResults")}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 px-6 text-xl">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && pageCount > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg text-muted-foreground">
            {t("admin.pageOf", { page: pageIndex + 1, total: pageCount })}
            {totalRows > 0 && ` · ${t("admin.totalRows", { count: totalRows })}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-lg"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="!size-4" />
              {t("admin.previous")}
            </Button>
            <Button
              variant="outline"
              className="text-lg"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("admin.next")}
              <ChevronRight className="!size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
