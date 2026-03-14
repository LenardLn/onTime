import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useThemeContext } from "../contexts/ThemeContextProvider";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeContext();

  const [active, setActive] = useState("1");

  const changeLanguage = (lng: string, id: string) => {
    i18n.changeLanguage(lng);
    setActive(id);
    localStorage.setItem("language", id);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const languages = [
    { id: "1", text: "RO" },
    { id: "2", text: "EN" },
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setActive(savedLanguage);
      i18n.changeLanguage(savedLanguage === "1" ? "ro" : "en");
    } else {
      localStorage.setItem("language", "1");
      i18n.changeLanguage("ro");
    }
  }, []);

  return (
    <div className="flex absolute top-0 z-20 w-full">
      <nav id="navbar" className="flex gap-4 mr-5 flex-wrap">
        <Link to="/">{t("homePage.home")}</Link>
        <Link to="/login">{t("homePage.login")}</Link>

        {languages.map((language) => (
          <span
            key={language.id}
            onClick={() =>
              changeLanguage(language.text.toLowerCase(), language.id)
            }
            className={`px-2 py-1 hover:cursor-pointer ${
              active === language.id ? "navbar__active" : ""
            }`}
          >
            {language.text}
          </span>
        ))}

        <button onClick={toggleTheme} className="hover:cursor-pointer">
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
