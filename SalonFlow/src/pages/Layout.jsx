import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Fixedui from "../ui/Fixedui";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="Layout-main" >
        <Outlet />
      </main>
      <Fixedui />
    </>
  );
};

export default Layout;