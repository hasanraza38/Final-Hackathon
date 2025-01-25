import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.jsx";
import Register from "./screens/register/Register.jsx";
import Dashboard from "./screens/dashboard/Dashboard.jsx";
import Login from "./screens/login/Login.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
         path:'',
         element: <App/>
      },
      {
        path: "/login",
        element:<Login/>
      },
      {
        path: '/register',
        element: <Register/>

      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      }
  ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}></RouterProvider>
);
