import { useThemeContext } from "../components/contexts/ThemeContextProvider";
import MapComponent from "../components/map/MapComponent";
import "../css/HomePage.css";

const HomePage = () => {
  const { theme } = useThemeContext();
  return <MapComponent theme={theme} />;
};

export default HomePage;
