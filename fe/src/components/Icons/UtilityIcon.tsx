import { SidebarMenuButton } from "@/components/shadcn/sidebar";
import type { MenuItem } from "@/hooks/useUserUtilities";

type Props = {
  item: MenuItem;
  className?: string;
  showTooltip?: boolean;
  buttonClass?: string;
};

const UtilityIcon = ({
  item,
  className,
  buttonClass,
  showTooltip = true,
}: Props) => {
  return (
    <SidebarMenuButton
      tooltip={showTooltip ? item.tooltip : undefined}
      onClick={item.onClick}
      className={`menu-button w-fit ${buttonClass ?? ""}`}
    >
      <img src={item.src} className={className} />
      {item.label && <span className="text-2xl">{item.label}</span>}
    </SidebarMenuButton>
  );
};

export default UtilityIcon;
