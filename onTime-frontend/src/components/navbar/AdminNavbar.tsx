import onTimeDark from "@/assets/onTime-dark.svg";
import onTimeLight from "@/assets/onTime-light.svg";
import busesSvg from "@/assets/buses.svg";
import linesSvg from "@/assets/lines.svg";
import profileSvg from "@/assets/profile.svg";
import routesSvg from "@/assets/routes.svg";
import stationsSvg from "@/assets/stations.svg";
import usersSvg from "@/assets/users.svg";
import dashboardSvg from "@/assets/dashboard.svg";
import toggleSidebarSvg from "@/assets/toggle.svg";
import { useAuthContext } from "@/components/contexts/authContext";
import { useThemeContext } from "@/components/contexts/ThemeContextProvider";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../shadcn/sidebar";

const AdminNavbar = () => {
  const { profile } = useAuthContext();
  const { theme, setTheme } = useThemeContext();
  const { toggleSidebar, state } = useSidebar();
  const { t, i18n } = useTranslation();

  const logo = theme === "light" ? onTimeLight : onTimeDark;
  const themedSvgClass =
    theme === "light"
      ? "brightness-0 saturate-100"
      : "invert brightness-0 saturate-100";
  const menuButtonClass = "h-20 flex items-center gap-4 px-4";

  type MenuItem = {
    labelKey: string;
    tooltipKey: string;
    to?: string;
    iconSvg: string;
  };

  const menuItems: MenuItem[] = [
    {
      labelKey: "admin.dashboard",
      tooltipKey: "admin.dashboard",
      to: "/admin/dashboard",
      iconSvg: dashboardSvg,
    },
    { labelKey: "admin.lines", tooltipKey: "admin.lines", iconSvg: linesSvg },
    {
      labelKey: "admin.routes",
      tooltipKey: "admin.routes",
      iconSvg: routesSvg,
    },
    {
      labelKey: "admin.stations",
      tooltipKey: "admin.stations",
      iconSvg: stationsSvg,
    },
    { labelKey: "admin.buses", tooltipKey: "admin.buses", iconSvg: busesSvg },
    { labelKey: "admin.users", tooltipKey: "admin.users", iconSvg: usersSvg },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    const next = i18n.language === "ro" ? "en" : "ro";
    i18n.changeLanguage(next);
    localStorage.setItem("language", next === "ro" ? "1" : "2");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton className={menuButtonClass} tooltip="onTime">
              <img
                src={logo}
                alt="onTime logo"
                className="size-[30px] shrink-0"
              />
              <span className="group-data-[collapsible=icon]:hidden font-semibold text-3xl">
                onTime
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const content = (
              <>
                <img
                  src={item.iconSvg}
                  alt={`${t(item.labelKey)} icon`}
                  className={`size-[30px] shrink-0 ${themedSvgClass} group-data-[collapsible=icon]:size-[30px] group-data-[collapsible=icon]:justify-center`}
                />
                <span
                  className="text-2xl
                            transition-all duration-200 ease-in-out
                            group-data-[collapsible=icon]:opacity-0
                            group-data-[collapsible=icon]:w-0
            q               group-data-[collapsible=icon]:ml-0
                            overflow-hidden whitespace-nowrap"
                >
                  {t(item.labelKey)}
                </span>
              </>
            );

            return (
              <SidebarMenuItem key={item.labelKey}>
                {item.to ? (
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.tooltipKey)}
                    className={menuButtonClass}
                  >
                    <NavLink to={item.to}>{content}</NavLink>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    tooltip={t(item.tooltipKey)}
                    className={menuButtonClass}
                  >
                    {content}
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Limbă"
              onClick={toggleLanguage}
              className={menuButtonClass}
            >
              <span className="text-2xl font-semibold">
                {i18n.language === "ro" ? "RO" : "EN"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Temă"
              onClick={toggleTheme}
              className={menuButtonClass}
            >
              <span className="text-2xl font-semibold justify-center">
                {theme === "dark" ? "🌙" : "☀️"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip="Toggle sidebar"
              className={menuButtonClass}
            >
              <img
                src={toggleSidebarSvg}
                alt="Toggle sidebar icon"
                className={`size-[30px] shrink-0 ${themedSvgClass} ${
                  state === "collapsed" ? "scale-x-[-1]" : ""
                }`}
              />
              <span className="group-data-[collapsible=icon]:hidden text-2xl">
                Toggle
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={profile?.email ?? "Logged user"}
              className={menuButtonClass}
            >
              <img
                src={profileSvg}
                alt="Profile icon"
                className={`size-[30px] shrink-0 ${themedSvgClass}`}
              />
              <span className="group-data-[collapsible=icon]:hidden truncate text-2xl">
                {profile?.email ?? "unknown@ontime.app"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminNavbar;
