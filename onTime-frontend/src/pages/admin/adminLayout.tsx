import Container from "@/components/container/Container";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Container className="justify-center h-screen">
      <nav>admin navbar placeholder</nav>
      <Outlet />
    </Container>
  );
};

export default AdminLayout;
