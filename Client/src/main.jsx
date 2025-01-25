import { createRoot } from "react-dom/client";
import "./index.css";
import Register from "./pages/RegisterUser.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Home from "./pages/Home.jsx";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/Register",
        element: <Register/>,
      },
      {
        path: "/Home",
        element: <Home />,
      },
      {
        path: "/Login",
        element: <Login />,
      },
      {
        path: "/Logout",
        element: <Logout />,
      },
      
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>

      <App />
   
   
  </RouterProvider>
);