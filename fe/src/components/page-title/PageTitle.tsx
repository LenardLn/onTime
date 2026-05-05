import type { MenuItem } from "@/hooks/useUserUtilities";
import { useThemeContext } from "../contexts/ThemeContextProvider";
import { themedSvg } from "../utils/themedSvg";
import chevronSvg from "@/assets/chevron.svg";
import UtilityIcon from "../Icons/UtilityIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageTitle = () => {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((part, index, arr) => ({
      label: decodeURIComponent(part),
      path: "/" + arr.slice(0, index + 1).join("/"),
    }));

  const chevronItem: MenuItem = {
    key: "back",
    src: chevronSvg,
    alt: "Back Button",
  };

  const themedSvgClass = themedSvg(theme);

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2 ml-8">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={crumb.path} className="flex items-center gap-2">
              <span
                onClick={isLast ? undefined : () => navigate(crumb.path)}
                className={`${isLast ? "text-light-blue underline" : "cursor-pointer hover:underline"} text-2xl font-bold`}
              >
                {Number(crumb.label)
                  ? crumb.label
                  : t(
                      `admin.${crumb.label === "admin" ? "dashboard" : crumb.label}`,
                    )}
              </span>

              {index < breadcrumbs.length - 1 && (
                <UtilityIcon
                  neutral={true}
                  buttonClass="!hover:cursor-normal !hover:bg-background !active:bg-background"
                  item={chevronItem}
                  className={`w-4 h-4 ${themedSvgClass} flex items-center rotate-180 `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PageTitle;
