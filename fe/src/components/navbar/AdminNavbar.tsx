import onTimeDark from "@/assets/onTime-dark.svg";
import onTimeLight from "@/assets/onTime-light.svg";
import busesSvg from "@/assets/buses.svg";
import linesSvg from "@/assets/lines.svg";
import routesSvg from "@/assets/routes.svg";
import stationsSvg from "@/assets/stations.svg";
import usersSvg from "@/assets/users.svg";
import dashboardSvg from "@/assets/dashboard.svg";
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
import { themedSvg } from "../utils/themedSvg";
import UserUtilitiesSidebar from "./UserUtilitiesSidebar";
import { appPaths } from "@/entities/enums/appPaths";

const AdminNavbar = () => {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  const logo = theme === "light" ? onTimeLight : onTimeDark;
  const themedSvgClass = themedSvg(theme);

  type MenuItem = {
    labelKey: string;
    tooltipKey: string;
    iconSvg: string;
    to?: string;
  };

  const menuItems: MenuItem[] = [
    {
      labelKey: "admin.dashboard",
      tooltipKey: "admin.dashboard",
      to: appPaths.adminDashboard,
      iconSvg: dashboardSvg,
    },
    {
      labelKey: "admin.lines",
      tooltipKey: "admin.lines",
      iconSvg: linesSvg,
      to: appPaths.adminLines,
    },
    {
      labelKey: "admin.routes",
      tooltipKey: "admin.routes",
      iconSvg: routesSvg,
      to: appPaths.adminRoutes,
    },
    {
      labelKey: "admin.stations",
      tooltipKey: "admin.stations",
      iconSvg: stationsSvg,
    },
    { labelKey: "admin.buses", tooltipKey: "admin.buses", iconSvg: busesSvg },
    { labelKey: "admin.users", tooltipKey: "admin.users", iconSvg: usersSvg },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton className={"menu-button__icon"} tooltip="onTime">
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
                            group-data-[collapsible=icon]:ml-0
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
                    className={"menu-button"}
                  >
                    <NavLink to={item.to}>{content}</NavLink>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    tooltip={t(item.tooltipKey)}
                    className={"menu-button"}
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
          <UserUtilitiesSidebar isMobile={isMobile} />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminNavbar;
