import Homepage from "./pages/Homepage.jsx";
import Venuepage from "./pages/Venuepage.jsx"
import Supplierpage from "./pages/Supplierpage.jsx"
import Aboutpage from "./pages/Aboutpage.jsx"
import Mediapage from "./pages/Mediapage.jsx"
import Contactpage from "./pages/Contactpage.jsx"
import Sidebar from "./components/Sidebar.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import HomeAdmin from "./components/HomeAdmin.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AboutAdmin from "./components/AboutAdmin.jsx";
import SuppliersAdmin from "./components/SuppliersAdmin.jsx";
import MediaAdmin from "./components/MediaAdmin.jsx";
import ContactAdmin from "./components/ContactAdmin.jsx";
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <><Homepage /></>
  },
  {
    path: "/venu",
    element: <><Venuepage /></>
  },
  {
    path: "/Suppliers",
    element: <><Supplierpage /></>
  },
  {
    path: "/About",
    element: <><Aboutpage /></>
  },
  {
    path: "/Media",
    element: <><Mediapage /></>
  },
  {
    path: "/Contact",
    element: <><Contactpage /></>
  },
  {
    path: "/admin",
    element: <><AdminLayout /></>,
    children: [
      {
        index: true,
        element: <><Dashboard/></>
      },
      {
       path: "home",
        element: <><HomeAdmin/></>
      },
      {
        path:"supply",
        element:<><SuppliersAdmin/></>
      },
      {
        path:"aboutadmin",
        element:<><AboutAdmin/></>
      },
      {
        path:"mediaadmin",
        element:<><MediaAdmin/></>
      },
      {
        path:"contactadmin",
        element:<><ContactAdmin/></>
      }
    ]
  },
  {

  }
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;