import useUserUtilities from "@/hooks/useUserUtilities";
import SidebarToggler from "./SidebarToggler";
import UtilityIcon from "../Icons/UtilityIcon";
import { useSidebar } from "../shadcn/sidebar";

const UserUtilitiesHeader = () => {
  const { items, themedSvgClass } = useUserUtilities();
  const { isMobile } = useSidebar();

  return (
    <div className="flex items-center gap-4">
      {!isMobile &&
        items.map((item) => (
          <UtilityIcon
            key={item.key}
            item={item}
            className={`size-[30px] ${themedSvgClass}`}
            showTooltip={false}
            buttonClass="!h-[30px]"
          />
        ))}
      {isMobile && (
        <SidebarToggler className={themedSvgClass} isMobile={isMobile} />
      )}
    </div>
  );
};

export default UserUtilitiesHeader;
