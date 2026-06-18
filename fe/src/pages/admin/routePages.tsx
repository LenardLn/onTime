import { useLineColumns } from "@/components/data-table/columns/GenericColumns";
import { DataTable } from "@/components/data-table/DataTable";
import CreateLineDialog from "@/components/line/CreateLineDialog";
import PageLoader from "@/components/loaders/PageLoader";
import { appPaths } from "@/entities/enums/appPaths";
import useLines from "@/hooks/admin/tanstack/useLines";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";

const RoutePage = () => {
  const { data: lines, isLoading, isError, error } = useLines();
  const columns = useLineColumns({
    getDetailPath: (id) => appPaths.adminRouteDetails(id),
    getCreateRoutePath: (id) => appPaths.adminCreateRoute(id),
    getEditRoutePath: (id) => appPaths.adminEditRoute(id),
    actionColumnName: "",
  });

  useErrorMessage({ isError, error });

  if (isLoading) return <PageLoader />;

  return (
    <div className="grid gap-4 p-6">
      <div className="flex justify-end">
        <CreateLineDialog />
      </div>
      <DataTable columns={columns} data={lines ?? []} />
    </div>
  );
};

export default RoutePage;
