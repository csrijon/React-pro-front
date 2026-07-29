// import Header from "./components/Header"
// import Herosection from "./components/Herosection"
// import Mainservicepage from "./components/Mainservicepage"
// import Fixedui from "./ui/Fixedui"
// import SearchBarlong from "../src/ui/SearchBarlong"
import Searchpage from "../src/components/Searchpage"
import ProviderDetails from "../src/components/ProviderDetails.jsx"
import Layout from "./pages/Layout.jsx"
import Homepage from "./pages/Homepage.jsx"
import Searchpagemain from "./pages/Searchpagemain.jsx"
import Bookingpage from "./pages/Bookingpage.jsx"
import Confirmpage from "./pages/Confirmpage.jsx"
import BookingSuccess from "./pages/BookingSuccess.jsx"

import {
  Routes, Route
} from "react-router-dom"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Homepage />} />
        <Route path="Search" element={<Searchpagemain />} />
        <Route path="Provider" element={<ProviderDetails />} />
        <Route path="Booking" element={<Bookingpage />} />
        <Route path="Confirm" element={<Confirmpage/>}/>
        <Route path="BookingSuccess" element={<BookingSuccess/>}/>
      </Route>
    </Routes>
  )
}

export default App