import Header from "./components/Header"
import Herosection from "./components/Herosection"
import Mainservicepage from "./components/Mainservicepage"
import Fixedui from "./ui/Fixedui"
import SearchBarlong from "../src/ui/SearchBarlong"
import Searchpage from "../src/components/Searchpage"
import ProviderDetails from "../src/components/ProviderDetails.jsx"
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router";


// const router = createBrowserRouter({
//   Path
// }
// )

const App = () => {
  return (
    <><Header /><Herosection /><Mainservicepage /><Fixedui /><SearchBarlong/><Searchpage/><ProviderDetails/></>
  )
}

export default App