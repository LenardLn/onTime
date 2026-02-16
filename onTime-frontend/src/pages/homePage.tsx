import { useThemeContext } from "../components/contexts/ThemeContextProvider";
import MapComponent from "../components/map/MapComponent";

const HomePage = () => {
  const { theme } = useThemeContext();
  return <MapComponent theme={theme} />;
};

export default HomePage;
