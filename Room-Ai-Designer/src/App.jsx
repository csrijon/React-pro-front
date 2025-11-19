
import './App.css'
import Homepage from './pages/Homepage'
import Supportpage from './pages/Supportpage';
import Dreampage from './pages/Dreampage';
import Subcriptionpage from './pages/Subcriptionpage';
import Footer from './components/Footer';
import Roomsencepage from './pages/Roomsencepage.jsx';
import Scanerpage from './pages/Scanerpage.jsx';
import ReviewSpacePage from './pages/ReviewSpacePage.jsx';
import TellUsvisionPage from './pages/TellUsvisionPage.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />
    },
    {
      path: "/contact",
      element: <Supportpage />
    },
    {
      path: "/subscription",
      element: <Subcriptionpage />
    },
    {
      path: "/dream",
      element: <Dreampage />
    },
    {
      path: "/roomsence",
      element: <Roomsencepage />
    },
    {
      path:"/Scaner",
      element:<Scanerpage/>
    },
    {
      path:"/review",
      element:<ReviewSpacePage/>
    },
    {
      path:"/Tellme",
      element:<TellUsvisionPage/>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
      <Footer />
    </>
  )
}

export default App
