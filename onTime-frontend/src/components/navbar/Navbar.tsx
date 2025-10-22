import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useThemeContext } from "../contexts/themeContextProvider";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const [active, setActive] = useState(0);

  const { theme, setTheme } = useThemeContext();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const changeLanguage = (lng: string, id: number) => {
    i18n.changeLanguage(lng);
    setActive(id);
  };

  const languages = [
    { id: 1, text: "RO" },
    { id: 2, text: "EN" },
  ];

  useEffect(() => {
    setActive(1);
  }, []);

  return (
    <div className="flex justify-center absolute top-0 z-20">
      <nav id="navbar" className="flex gap-4 mr-5">
        <Link to="/" className="">
          {t(`homePage.home`)}
        </Link>
        <Link to="/login">{t(`homePage.login`)}</Link>
        {languages.map((language) => (
          <span
            key={language.id}
            onClick={() =>
              changeLanguage(language.text.toLowerCase(), language.id)
            }
            className={`px-2 py-1 hover:cursor-pointer ${
              active === language.id && "navbar__active"
            }`}
          >
            {language.text}
          </span>
        ))}
        <button onClick={toggleTheme}>
          {theme === "dark" ? "Dark" : "Light"}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
