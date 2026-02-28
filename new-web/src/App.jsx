import './App.css'
import Scrolltop from './components/Scrolltop'
import Routeabout from './components/Routeabout'
import Funfact from './ui/Funfact'
import Experience from './components/Experience'
import MainLayout from './pages/MainLayout'
import Homepage from './pages/Homepage'
import Allprojectpage from './pages/Allprojectpage'
import Aboutpage from './pages/Aboutpage'
import Experiencepage from './pages/Experiencepage'
import Contactpage from './pages/Contactpage'
import { createBrowserRouter, RouterProvider } from "react-router-dom";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children:[
      {
        index: true,
        element: <Homepage />
        
      },
      {
        path: "allprojects",
        element: <Allprojectpage />
      },
      {
        path: "aboutme",
        element: <Aboutpage />
      },
      {
        path: "experience",
        element: <Experiencepage />
      },
      {
        path: "contact",
        element: <Contactpage />
      }
    ]
  }
])
function App() {
  return <RouterProvider router={router} />;
}

export default App
