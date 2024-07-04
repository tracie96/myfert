import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GetSideBarPermission } from "../../utils/Permission/SideBarPermission";

const ProtectedLayout = () => {
  const userAuth = useSelector((state) => state?.authentication?.userAuth);
  const getURlLOcation = useLocation();
  const getPermissions = GetSideBarPermission(userAuth?.role);
  const checkPermission = getPermissions?.some(
    (item) => item.Name === getURlLOcation.pathname
  );

  return (
    <>
      {userAuth ? (
        checkPermission ? (
          <Outlet />
        ) : (
          <Navigate to="/home" />
        )
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default ProtectedLayout;
