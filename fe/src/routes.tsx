import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/layout";
import ErrorPage from "./pages/errorPage";
import HomePage from "./pages/homePage";
import AuthPage from "./pages/authPage";
import { useAuthContext } from "./components/contexts/authContext";
import AdminLayout from "./pages/admin/adminLayout";
import DashboardPage from "./pages/admin/dashboardPage";
import ProfilePage from "./pages/admin/profilePage";
import LinesPage from "./pages/admin/linesPage";
import { appPaths } from "./entities/enums/appPaths";
import LineDetailsPage from "./pages/admin/lineDetailsPage";
import RoutePage from "./pages/admin/routePages";
import RouteDetailsPage from "./pages/admin/routeDetailsPage";

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
        element: <DashboardPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "lines",
        element: <LinesPage />,
      },
      {
        path: appPaths.adminLineDetails(":lineId"),
        element: <LineDetailsPage />,
      },
      {
        path: appPaths.adminRoutes,
        element: <RoutePage />,
      },
      {
        path: appPaths.adminRouteDetails(":id"),
        element: <RouteDetailsPage />,
      },
    ],
  },
]);
export default router;
