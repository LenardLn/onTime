import useUserUtilities from "@/hooks/useUserUtilities";
import { SidebarMenuItem } from "../shadcn/sidebar";
import SidebarToggler from "./SidebarToggler";
import UtilityIcon from "../Icons/UtilityIcon";

const UserUtilitiesSidebar = ({ isMobile }: { isMobile: boolean }) => {
  const { items, themedSvgClass } = useUserUtilities();

  return (
    <div className="flex flex-col gap-2">
      {!isMobile && <SidebarToggler className={themedSvgClass} isMobile={isMobile} />}
      {isMobile &&
        items.map((item) => (
          <SidebarMenuItem key={item.key}>
            <UtilityIcon
              key={item.key}
              item={item}
              className={`size-[30px] shrink-0 ${themedSvgClass}`}
            />
          </SidebarMenuItem>
        ))}
    </div>
  );
};

export default UserUtilitiesSidebar;
