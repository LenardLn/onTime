import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/layout";
import ErrorPage from "./pages/errorPage";
import HomePage from "./pages/homePage";
import AuthPage from "./pages/authPage";
import { useAuthContext } from "./components/contexts/authContext";
import AdminLayout from "./pages/admin/adminLayout";
import Dashboard from "./pages/admin/dashboard";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <AuthPage mode="login" /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "register",
        element: <AuthPage mode="register" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
export default router;
