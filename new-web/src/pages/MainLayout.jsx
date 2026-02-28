import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Scrolltop from '../components/Scrolltop';
import { Outlet } from "react-router";

const MainLayout = () => {
    return (
        <>
            <Header />
            <Scrolltop />
            <Outlet />
            <Footer />
        </>
    )
}

export default MainLayout;