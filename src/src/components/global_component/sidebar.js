import React, { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import UserDropdown from "./UserDropdown";
import { GetSideBar } from "../../utils/Permission/GetSideBar";

const Sidebar = () => {
  const [showUserDropdownModal, setshowUserDropdownModal] = useState(false);
  const handleCloseModal = () => {
    setshowUserDropdownModal(false);
  };
  useEffect(() => {}, []);

  return (
    <>
      <GetSideBar />

      <CustomModal
        show={showUserDropdownModal}
        onHide={handleCloseModal}
        size="lg"
        classes="bg-primary text-white py-2"
        title={"User Document"}
        body={
          <>
            <UserDropdown onSuccessModal={setshowUserDropdownModal} />
          </>
        }
      />
    </>
  );
};

export default Sidebar;
