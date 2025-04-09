import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <div className="container">
            <Header />
            <div className="render-output">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;