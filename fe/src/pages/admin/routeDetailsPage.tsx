import PageLoader from "@/components/loaders/PageLoader";
import MapComponent, { MapView } from "@/components/map/MapComponent";
import useRoute from "@/hooks/admin/tanstack/useRoute";
import useRoute2 from "@/hooks/admin/tanstack/useRoute2";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";
import { useParams } from "react-router-dom";

const LineDetailsPage = () => {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error
  } = useRoute2({ line_ids: [id!] });

  useErrorMessage({ isError, error });
  if (isLoading) return <PageLoader />;

  return <MapComponent mode={MapView.VIEW} routeData={data?.response} />;
};

export default LineDetailsPage;
