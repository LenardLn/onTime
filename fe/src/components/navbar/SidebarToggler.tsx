import toggleSidebarSvg from "@/assets/toggle.svg";
import menuSvg from "@/assets/menu.svg";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/shadcn/sidebar";
import { t } from "i18next";

interface SidebarTogglerProps {
  className: string;
  isMobile: boolean;
}

const SidebarToggler = ({ className, isMobile }: SidebarTogglerProps) => {
  const { toggleSidebar, state } = useSidebar();
  const menuButtonClass = "h-20 flex items-center gap-4 px-4";

  const directionClass = state === "collapsed" ? "scale-x-[-1]" : "";

  const baseClass = `
  size-[30px] cursor-pointer ${className}
  ${directionClass}
`;

  const positionClass = state === "expanded" && "bottom-26 left-4 top-auto";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={toggleSidebar}
        tooltip={t("admin.toggle")}
        className={menuButtonClass}
      >
        <img
          src={isMobile ? menuSvg : toggleSidebarSvg}
          alt="Toggle sidebar icon"
          className={`${baseClass} ${positionClass}`}
        />
        {!isMobile && (
          <span className="group-data-[collapsible=icon]:hidden text-2xl">
            {t("admin.toggle")}
          </span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarToggler;
