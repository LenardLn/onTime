import { useThemeContext } from "../components/contexts/themeContextProvider";
import MapComponent from "../components/map/MapComponent";

const HomePage = () => {
  const { theme } = useThemeContext();
  return <MapComponent theme={theme} />;
};

export default HomePage;
