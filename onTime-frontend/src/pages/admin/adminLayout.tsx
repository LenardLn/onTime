import Container from "@/components/container/Container";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import { SidebarProvider } from "@/components/shadcn/sidebar";
import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";

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
      <AdminNavbar />
      <main>
        <Container className="justify-center h-screen">
          <Outlet />
        </Container>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
