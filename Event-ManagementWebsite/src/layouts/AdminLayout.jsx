import React from "react";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { Outlet } from "react-router";
import "../css/AdminLayout.css";

const AdminLayout = () => {
  return (
    <section className="admin-page">
      <Sidebar />

      <div className="admin-right">
        <AdminHeader />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default AdminLayout;
