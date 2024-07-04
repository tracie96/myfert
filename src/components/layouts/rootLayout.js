import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "../global_component/sidebar";
import MyNavbar from "../global_component/navbar";
import Footer from "../global_component/footer";
import { useSelector } from "react-redux";

const RootLayout = () => {
  const userAuth = useSelector((state) => state?.authentication?.userAuth);

  if (Object.keys(userAuth).length === 0) {
    return <Navigate to="/" />;
  }

  if (userAuth && userAuth?.role === "Patient" && !userAuth.isPaymentComplete) {
    return <Navigate to="/subscription-plan" />;
  }

  return (
    <>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* Topbar */}
            <MyNavbar />
            {/* End of Topbar */}

            {/* Begin Page Content */}
            <div className="container-fluid">
              <Outlet />
              {/* <MainDashboard /> */}
              {/* <AddUser /> */}
              {/* <EditUser /> */}
              {/* <UserList /> */}
            </div>

            {/* End of Page Content */}
          </div>
          <Footer />
        </div>
      </div>
      {/* <Login /> */}
      {/* <Register /> */}
      {/* <ForgotPassword /> */}
    </>
  );
};

export default RootLayout;
