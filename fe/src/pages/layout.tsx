import Container from "@/components/container/Container";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Container className="justify-center w-auto">
      <Navbar />
      <Outlet />
    </Container>
  );
};

export default Layout;
