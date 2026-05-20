import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../../assets/css/manage.css';

const ManageLayout = () => {
    return (
        <div className="hmk-manage-layout">
            <Sidebar />
            <div className="hmk-manage-main">
                <Header />
                <div className="hmk-manage-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ManageLayout; 