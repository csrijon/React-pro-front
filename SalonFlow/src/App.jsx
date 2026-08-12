import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./pages/Layout";

// Lazy Loaded Pages
const Homepage = lazy(() => import("./pages/Homepage"));
const Searchpagemain = lazy(() => import("./pages/Searchpagemain"));
const ProviderDetails = lazy(() => import("./components/ProviderDetails"));
const Bookingpage = lazy(() => import("./pages/Bookingpage"));
const Confirmpage = lazy(() => import("./pages/Confirmpage"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));

const App = () => {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="search" element={<Searchpagemain />} />
          <Route path="provider" element={<ProviderDetails />} />
          <Route path="booking" element={<Bookingpage />} />
          <Route path="confirm" element={<Confirmpage />} />
          <Route path="bookingsuccess" element={<BookingSuccess />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;