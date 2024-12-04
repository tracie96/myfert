import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <>
      <div id="wrapper">
        <div id="content-wrapper" className="bg-layout d-flex flex-column">
          <div id="content">
            {/* Begin Page Content */}
            <Outlet />
            {/* <div className="container-fluid">
            </div> */}
            {/* End of Page Content */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
