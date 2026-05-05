import PageLoader from "@/components/loaders/PageLoader";
import useLine from "@/hooks/admin/tanstack/useLine";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";
import { useParams } from "react-router-dom";

const LineDetailsPage = () => {
  const { id } = useParams();

  const { data: line, isLoading, isError, error } = useLine(id!);

  useErrorMessage({ isError, error });
  if (isLoading) return <PageLoader />;
  return <div>lineDetailsPage</div>;
};

export default LineDetailsPage;
