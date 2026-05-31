import { useThemeContext } from "../components/contexts/ThemeContextProvider";
import ViewMap from "../components/map/ViewMap";
import "../css/HomePage.css";

const HomePage = () => {
  const { theme } = useThemeContext();
  return (
    <div className="h-screen">
      <ViewMap mode={"view"} />
    </div>
  );
};

export default HomePage;
