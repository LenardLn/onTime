import { SidebarMenuButton } from "@/components/shadcn/sidebar";
import type { MenuItem } from "@/hooks/useUserUtilities";

type Props = {
  item: MenuItem;
  className?: string;
  showTooltip?: boolean;
  buttonClass?: string;
  neutral?: boolean;
};

const UtilityIcon = ({
  item,
  className,
  buttonClass,
  showTooltip = true,
  neutral = false,
}: Props) => {
  return (
    <SidebarMenuButton
      tooltip={showTooltip ? item.tooltip : undefined}
      onClick={item.onClick}
      className={`menu-button w-fit hover:cursor-pointer ${buttonClass ?? ""} ${
        neutral
          ? "!bg-transparent !shadow-none !hover:bg-transparent !active:bg-transparent !focus:bg-transparent !data-[state=open]:bg-transparent !data-[active=true]:bg-transparent"
          : ""
      }`}
    >
      <img src={item.src} className={className} />
      {item.label && <span className="text-2xl">{item.label}</span>}
    </SidebarMenuButton>
  );
};

export default UtilityIcon;
