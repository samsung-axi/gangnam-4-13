import { Outlet } from "react-router-dom";
import React from 'react';
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";

const Layout = () => {
    return (
        <>
            <div className="layout-container">
                <Sidebar/>
                    <div className="layout-main">
                        <Outlet />
                    </div>
                <Footer />
            </div>
            
        </>
    );
};

export default Layout;