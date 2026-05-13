import { useLineColumns } from "@/components/data-table/columns/GenericColumns";
import { DataTable } from "@/components/data-table/DataTable";
import PageLoader from "@/components/loaders/PageLoader";
import { Button } from "@/components/shadcn/button";
import { appPaths } from "@/entities/enums/appPaths";
import useCreateLine from "@/hooks/admin/tanstack/useCreateLine";
import useLines from "@/hooks/admin/tanstack/useLines";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";

const RoutePage = () => {
  const { data: lines, isLoading, isError, error } = useLines();
  const columns = useLineColumns({
    getDetailPath: (id) => appPaths.adminRouteDetails(id),
    getCreateRoutePath: (id) => appPaths.adminCreateRoute(id),
    actionColumnName: "",
  });

  const { mutate: createLine } = useCreateLine();

  useErrorMessage({ isError, error });

  if (isLoading) return <PageLoader />;

  return (
    <>
      <Button onClick={() => createLine("text Lucian STOIAN")}>
        Create New Line
      </Button>
      <DataTable columns={columns} data={lines ?? []} />
    </>
  );
};

export default RoutePage;
