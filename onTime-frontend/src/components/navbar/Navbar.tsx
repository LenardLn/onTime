import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const [active, setActive] = useState(0);

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
    <div className="flex justify-center">
      <nav className="flex gap-4 mr-5">
        <Link to="/" className="">
          {t(`homePage.home`)}
        </Link>
        <Link to="/login">{t(`homePage.login`)}</Link>
      </nav>
      <div>
        {languages.map((language) => (
          <span
            key={language.id}
            onClick={() =>
              changeLanguage(language.text.toLowerCase(), language.id)
            }
            className={`px-2 py-1 hover:cursor-pointer ${
              active === language.id && "underline"
            }`}
          >
            {language.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
