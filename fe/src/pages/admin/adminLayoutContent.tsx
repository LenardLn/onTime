import Container from "@/components/container/Container";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import { Outlet } from "react-router-dom";
import UserUtilitiesHeader from "@/components/navbar/UserUtilitiesHeader";
import PageTitle from "@/components/page-title/PageTitle";

const AdminLayoutContent = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AdminNavbar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 flex shrink-0 gap-4 justify-between bg-sidebar shadow-[0_2px_5px_var(--color-shadow)]">
          <PageTitle />
          <UserUtilitiesHeader />
        </header>

        <Container className="flex-1 min-h-0">
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default AdminLayoutContent;
