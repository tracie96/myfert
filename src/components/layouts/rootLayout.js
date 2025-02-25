import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "../global_component/sidebar";
import Footer from "../global_component/footer";
import { useSelector } from "react-redux";
import MyNavbar from "../global_component/navbar";
{console.log("333--", MyNavbar);}
const RootLayout = () => {
  const userAuth = useSelector((state) => state?.authentication?.userAuth);
  if (!userAuth || Object.keys(userAuth)?.length === 0) {
    return <Navigate to="/" />;
  }

  if (userAuth && userAuth?.role === "Patient" && !userAuth.isPaymentComplete) {
    return <Navigate to="/subscription-plan" />;
  }

  return (
    <>
      <div id="wrapper">
        <Sidebar />
        <div class="resBtnContent">
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content" style={{ background: "#fff" }}>
            <MyNavbar />
            <div className="container-fluid">
              <Outlet />
              {/* <DashboardMain /> */}
              {/* <AddUser /> */}
              {/* <EditUser /> */}
              {/* <UserList /> */}
            </div>

            {/* End of Page Content */}
          </div>
          <Footer />
        </div>
        </div>
      </div>
      {/* <Login /> */}
      {/* <Register /> */}
      {/* <ForgotPassword /> */}
    </>
  );
};

export default RootLayout;
