import Homepage from "./pages/Homepage.jsx";
import Venuepage from "./pages/Venuepage.jsx"
import Supplierpage from "./pages/Supplierpage.jsx"
import Aboutpage from "./pages/Aboutpage.jsx"
import Mediapage from "./pages/Mediapage.jsx"
import Contactpage from "./pages/Contactpage.jsx"
import Sidebar from "./components/Sidebar.jsx";
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
    path:"/Admin",
     element:<><Sidebar/></>
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