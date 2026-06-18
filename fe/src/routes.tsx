import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/layout";
import ErrorPage from "./pages/errorPage";
import HomePage from "./pages/homePage";
import AuthPage from "./pages/authPage";
import { useAuthContext } from "./components/contexts/authContext";
import AdminLayout from "./pages/admin/adminLayout";
import DashboardPage from "./pages/admin/dashboardPage";
import ProfilePage from "./pages/admin/profilePage";
import { appPaths } from "./entities/enums/appPaths";
import RoutePage from "./pages/admin/routePages";
import RouteDetailsPage from "./pages/admin/routeDetailsPage";
import ManageRoutePage from "./pages/admin/manageRoutePage";
import StationsPage from "./pages/admin/stationsPage";
import UsersPage from "./pages/admin/usersPage";

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
        index: true,
        element: <Navigate to={appPaths.adminDashboard} replace />,
      },
      {
        path: "register",
        element: <AuthPage mode="register" />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: appPaths.adminStations,
        element: <StationsPage />,
      },
      {
        path: appPaths.adminUsers,
        element: <UsersPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: appPaths.adminRoutes,
        element: <RoutePage />,
      },
      {
        path: appPaths.adminRouteDetails(":id"),
        element: <RouteDetailsPage />,
      },
      {
        path: appPaths.adminCreateRoute(":id"),
        element: <ManageRoutePage />,
      },
      {
        path: appPaths.adminEditRoute(":id"),
        element: <ManageRoutePage />,
      },
    ],
  },
]);
export default router;
