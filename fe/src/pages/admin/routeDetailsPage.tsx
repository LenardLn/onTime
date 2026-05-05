import PageLoader from "@/components/loaders/PageLoader";
import MapComponent, { MapView } from "@/components/map/MapComponent";
import useRoute from "@/hooks/admin/tanstack/useRoute";
import useRoute2 from "@/hooks/admin/tanstack/useRoute2";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";
import { useParams } from "react-router-dom";

const LineDetailsPage = () => {
  const { id } = useParams();

  const {
    data: route,
    isLoading,
    isError,
    error,
  } = useRoute({ line_ids: [id!] });

  const {
    data: test,
  } = useRoute2({ line_ids: [id!] });

  console.log(test, "route2");

  useErrorMessage({ isError, error });
  if (isLoading) return <PageLoader />;

  return <MapComponent markerList={route?.routes} mode={MapView.VIEW} test={[]} />;
};

export default LineDetailsPage;
