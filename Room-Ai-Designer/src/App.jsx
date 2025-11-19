
import './App.css'
import Homepage from './pages/Homepage'
import Supportpage from './pages/Supportpage';
import Dreampage from './pages/Dreampage';
import Subcriptionpage from './pages/Subcriptionpage';
import Footer from './components/Footer';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {path:"/",
      element:<Homepage/>
    },
    {
      path:"/contact",
      element:<Supportpage/>
    },
    {
      path:"/subscription",
      element:<Subcriptionpage/>
    },
    {
      path:"/dream",
      element:<Dreampage/>

    }
  ])

  return (
    <>
    <RouterProvider router={router}/>
    <Footer/>
    </>
  )
}

export default App
