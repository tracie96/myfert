export const GetSideBarPermission = (getRole) => {
  if (getRole === "SuperAdmin") {
    return [
      { Name: "/profile", Permission: true },
      { Name: "/update-password", Permission: true },
      { Name: "/home", Permission: true },
      { Name: "/preview-Link", Permission: true },
      // { Name: "/assessment", Permission: true },
      // { Name: "/medication", Permission: true },
      // { Name: "/appointment", Permission: true },
      // { Name: "/learn", Permission: true },
      // { Name: "/add-user", Permission: true },
      // { Name: "/user-list", Permission: true },
    ];
  } else if (getRole === "Doctor" || getRole === "Coach") {
    return [
      { Name: "/profile", Permission: true },
      { Name: "/update-password", Permission: true },
      { Name: "/home", Permission: true },
      // { Name: "/assessment", Permission: true },
      // { Name: "/medication", Permission: true },
      { Name: "/appointment", Permission: true },
      // { Name: "/learn", Permission: true },
      { Name: "/add-user", Permission: true },
      { Name: "/user-list", Permission: true },
    ];
  } else if (getRole === "Patient") {
    return [
      { Name: "/subscription-plan", Permission: true },
      { Name: "/profile", Permission: true },
      { Name: "/update-password", Permission: true },
      { Name: "/home", Permission: true },
      { Name: "/assessment", Permission: true },
      { Name: "/medication", Permission: true },
      { Name: "/appointment", Permission: true },
      { Name: "/learn", Permission: true },
      {
        Name: "/subscription-plan-succeeded/:paymentTimeTicks",
        Permission: true,
      },
    ];
  } else {
    return [
      { Name: "/profile", Permission: true },
      { Name: "/update-password", Permission: true },
      { Name: "/home", Permission: true },
      { Name: "/assessment", Permission: true },
      { Name: "/medication", Permission: true },
      { Name: "/appointment", Permission: true },
      { Name: "/learn", Permission: true },
    ];
  }
};
