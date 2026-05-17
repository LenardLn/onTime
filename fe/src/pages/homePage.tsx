import { useThemeContext } from "../components/contexts/ThemeContextProvider";
import ViewMap from "../components/map/ViewMap";
import "../css/HomePage.css";

const HomePage = () => {
  const { theme } = useThemeContext();
  return <ViewMap mode={"view"} />;
};

export default HomePage;
