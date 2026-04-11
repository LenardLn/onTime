import { SidebarProvider } from "@/components/shadcn/sidebar";
import type { CSSProperties } from "react";
import AdminLayoutContent from "./adminLayoutContent";

const AdminLayout = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-icon": "5.2rem",
        } as CSSProperties
      }
    >
      <AdminLayoutContent />
    </SidebarProvider>
  );
};

export default AdminLayout;
