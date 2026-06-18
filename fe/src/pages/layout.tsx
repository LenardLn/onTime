import Container from "@/components/container/Container";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { UserLocationProvider } from "@/components/contexts/userLocationContext";

const Layout = () => {
  return (
    <UserLocationProvider>
      <Container className="flex min-h-screen w-full flex-col">
        <Navbar />
        <Outlet />
      </Container>
    </UserLocationProvider>
  );
};

export default Layout;
