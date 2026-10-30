import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/login";
import Rigister from "./pages/Register";
import CarInfo from "./pages/CarInfo";
import DashBoard from "./pages/Dashboard";
import New from "./pages/Dashboard/New";
import Layout from "./components/Layout";
import DashBoardLayout from "./components/DashBoardLayout";
import LoginLayout from "./components/LoginLayout";
import Private from "./routes/Private";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: <CarInfo />,
      },
      {
        element: (
          <Private>
            <DashBoardLayout />
          </Private>
        ),
        children: [
          {
            path: "/dashboard",
            element: <DashBoard />,
          },
          {
            path: "/dashboard/new",
            element: <New />,
          },
        ],
      },
    ],
  },
  {
    element: <LoginLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Rigister />,
      },
    ],
  },
]);

export default function RouterProviderApp() {
  return <RouterProvider router={router} />;
}
