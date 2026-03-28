// hooks/useUserUtilities.ts

import { useThemeContext } from "@/components/contexts/ThemeContextProvider";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/components/contexts/authContext";

import ENSvg from "@/assets/EN.svg";
import ROSvg from "@/assets/RO.svg";
import darkSvg from "@/assets/dark.svg";
import lightSvg from "@/assets/light.svg";
import profileSvg from "@/assets/profile.svg";
import { themedSvg } from "@/components/utils/themedSvg";

export type MenuItem = {
  key: string;
  src: string;
  alt: string;
  tooltip?: string;
  onClick?: () => void;
  label?: string;
};

const useUserUtilities = () => {
  const { theme, setTheme } = useThemeContext();
  const { i18n, t } = useTranslation();
  const { profile } = useAuthContext();
  const themedSvgClass = themedSvg(theme);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    const next = i18n.language === "ro" ? "en" : "ro";
    i18n.changeLanguage(next);
    localStorage.setItem("language", next);
  };

  return {
    items: [
      {
        key: "language",
        src: i18n.language === "ro" ? ROSvg : ENSvg,
        alt: "Language Icon",
        tooltip: t("admin.language"),
        onClick: toggleLanguage,
      },
      {
        key: "theme",
        src: theme === "dark" ? darkSvg : lightSvg,
        alt: "Theme Icon",
        tooltip: t("admin.theme"),
        onClick: toggleTheme,
      },
      {
        key: "profile",
        src: profileSvg,
        alt: "Profile Icon",
        label: profile?.email ?? "unknown@ontime.app",
      },
    ],
    themedSvgClass,
  };
};

export default useUserUtilities;