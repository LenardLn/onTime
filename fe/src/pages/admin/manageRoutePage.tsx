import { MapEditorProvider } from "@/components/contexts/mapEditorContext";
import ManageMap from "@/components/map/ManageMap";

const ManageRoutePage = () => {
  return (
    <MapEditorProvider>
      <ManageMap />
    </MapEditorProvider>
  );
};

export default ManageRoutePage;
