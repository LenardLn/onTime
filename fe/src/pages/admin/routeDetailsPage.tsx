import PageLoader from "@/components/loaders/PageLoader";
import ViewMap, { MapView } from "@/components/map/ViewMap";
import useRoute from "@/hooks/admin/tanstack/useRoute";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";
import { useParams } from "react-router-dom";

const LineDetailsPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useRoute({ line_ids: [id!] });

  useErrorMessage({ isError, error });
  if (isLoading) return <PageLoader />;

  return <ViewMap mode={MapView.VIEW} routeData={data?.response} />;
};

export default LineDetailsPage;
