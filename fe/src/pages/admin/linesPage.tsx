import { useLineColumns } from "@/components/data-table/columns/GenericColumns";
import { DataTable } from "@/components/data-table/DataTable";
import PageLoader from "@/components/loaders/PageLoader";
import { appPaths } from "@/entities/enums/appPaths";
import useLines from "@/hooks/admin/tanstack/useLines";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";

const LinesPage = () => {
  const { data: lines, isLoading, isError, error } = useLines();
  const columns = useLineColumns({
    getDetailPath: (line) => appPaths.adminLineDetails(line.id),
  });
  useErrorMessage({ isError, error });

  if (isLoading) return <PageLoader />;

  return (
    <>
      <DataTable columns={columns} data={lines ?? []} />
    </>
  );
};

export default LinesPage;
