
import './App.css'
import Homepage from './pages/Homepage'
import Supportpage from './pages/Supportpage';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {path:"/",
      element:<Homepage/>
    },
    {
      path:"/contact",
      element:<Supportpage/>
    }
  ])

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
