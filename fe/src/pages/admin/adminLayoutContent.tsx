import Container from "@/components/container/Container";
import AdminNavbar from "@/components/navbar/AdminNavbar";
import { Outlet } from "react-router-dom";
import UserUtilitiesHeader from "@/components/navbar/UserUtilitiesHeader";
import chevronSvg from "@/assets/chevron.svg";

const AdminLayoutContent = () => {
  return (
    <>
      <AdminNavbar />
      <main className="w-full">
        <header className="h-24 flex gap-4 justify-between bg-sidebar border-b-1 border-black">
          {/* to be extracted into a PageTitle.tsx component */}
          <div className="flex gap-4 items-center">
            <img
              className="size-[20px] inline"
              src={chevronSvg}
              alt="Back Button"
            />
            <p className="text-2xl"> Back button w/ breadcrumbs</p>
            <div className="text-3xl">Page Title</div>
          </div>
          <UserUtilitiesHeader />
        </header>
        <Container className="justify-center h-screen">
          <Outlet />
        </Container>
      </main>
    </>
  );
};

export default AdminLayoutContent;
