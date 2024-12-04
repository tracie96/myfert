import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { GetSideBarPermission } from "../../utils/Permission/SideBarPermission";

const ProtectedLayout = () => {
  const userAuth = useSelector((state) => state?.authentication?.userAuth);
  const getURlLOcation = useLocation();
  const getPermissions = GetSideBarPermission(userAuth?.role);
  const checkPermission = getPermissions?.some(
    (item) => item.Name === getURlLOcation.pathname,
  );

  return (
    <>
      {userAuth ? (
        checkPermission ? (
          <Navigate to="/dashboard" />
        ) : (
          <Navigate to="/dashboard" />
        )
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default ProtectedLayout;
