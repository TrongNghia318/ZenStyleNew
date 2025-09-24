import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function DashboardLayout() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="main-content flex-grow-1">
          
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;