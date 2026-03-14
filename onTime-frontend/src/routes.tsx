import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/layout";
import ErrorPage from "./pages/errorPage";
import HomePage from "./pages/homePage";
import RegisterPage from "./pages/registerPage";
import { useAuthContext } from "./components/contexts/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  return true || isAuthenticated ? children : <Navigate to={"/"} replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/admin/register",
        element: (
          <PrivateRoute>
            <RegisterPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
