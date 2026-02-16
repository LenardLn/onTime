import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/layout";
import ErrorPage from "./pages/errorPage";
import HomePage from "./pages/homePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <HomePage /> }],
  },
]);

export default router;
