import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Scrolltop from '../components/Scrolltop';
import { Outlet } from 'react-router';


const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            <Scrolltop />
        </>
    )
}

export default MainLayout;