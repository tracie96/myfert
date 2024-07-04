import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomModal from "./CustomModal";
import UserDropdown from "./UserDropdown";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import testIcon from "../../assets/images/sidebar/taskSearch.png";
import assessIcon from "../../assets/images/sidebar/analytics.png";
import medsIcon from "../../assets/images/sidebar/care.png";
import apptIcon from "../../assets/images/sidebar/calender.png";
import learnIcon from "../../assets/images/sidebar/instruction.png";
import { GetSideBar } from "../../utils/Permission/GetSideBar";

const Sidebar = () => {
  const { userAuth } = useSelector((state) => state.authentication);
  const [showUserDropdownModal, setshowUserDropdownModal] = useState(false);
  const handleCloseModal = () => {
    setshowUserDropdownModal(false);
  };

  useEffect(() => {
    const handleSidebarToggle = () => {
      const sidebar = document.querySelector(".sidebar");
      const isToggled = sidebar.classList.contains("toggled");

      document.body.classList.toggle("sidebar-toggled");
      sidebar.classList.toggle("toggled");

      if (!isToggled && sidebar.classList.contains("toggled")) {
        // eslint-disable-next-line no-undef
        const collapseElement = new bootstrap.Collapse(sidebar, {
          toggle: false,
        });
        collapseElement.hide();
      }
    };

    const handleWindowResize = () => {
      // eslint-disable-next-line no-undef
      const sidebarCollapse = new bootstrap.Collapse(
        document.querySelector(".sidebar .collapse"),
        {
          toggle: false,
        }
      );

      if (window.innerWidth < 768) {
        sidebarCollapse.hide();
      }

      if (
        window.innerWidth < 480 &&
        !document.querySelector(".sidebar").classList.contains("toggled")
      ) {
        document.body.classList.add("sidebar-toggled");
        document.querySelector(".sidebar").classList.add("toggled");
        sidebarCollapse.hide();
      }
    };

    const handleMouseWheel = (e) => {
      if (window.innerWidth > 768) {
        const delta = e.deltaY || -e.detail || e.wheelDelta; // Use whichever property is available
        const sidebar = document.querySelector("body.fixed-nav .sidebar");

        if (sidebar) {
          sidebar.scrollTop += (delta < 0 ? 1 : -1) * 30;
          e.preventDefault();
        }
      }
    };

    const handleScroll = () => {
      const scrollDistance = window.scrollY;
      if (scrollDistance > 100) {
        document.querySelector(".scroll-to-top").style.display = "block";
      } else {
        document.querySelector(".scroll-to-top").style.display = "none";
      }
    };

    const handleScrollToTop = (e) => {
      const $anchor = e.target;
      document.querySelector("html, body").animate(
        {
          scrollTop: document.querySelector($anchor.getAttribute("href"))
            .offsetTop,
        },
        1000,
        "easeInOutExpo"
      );
      e.preventDefault();
    };

    // Event listeners
    document
      .getElementById("sidebarToggle")
      .addEventListener("click", handleSidebarToggle);
    document
      .getElementById("sidebarToggleTop")
      .addEventListener("click", handleSidebarToggle);
    window.addEventListener("resize", handleWindowResize);

    // Cleanup listeners on component unmount
    return () => {
      document
        .getElementById("sidebarToggle")
        ?.removeEventListener("click", handleSidebarToggle);
      document
        .getElementById("sidebarToggleTop")
        ?.removeEventListener("click", handleSidebarToggle);
      window?.removeEventListener("resize", handleWindowResize);
      document?.body.removeEventListener("mousewheel", handleMouseWheel);
      document?.body.removeEventListener("DOMMouseScroll", handleMouseWheel);
      window?.removeEventListener("scroll", handleScroll);
      document?.removeEventListener("click", (e) => {
        if (e.target.classList.contains("scroll-to-top")) {
          handleScrollToTop(e);
        }
      });
    };
  }, []);

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
