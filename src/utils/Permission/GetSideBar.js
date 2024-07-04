import React from "react";
import { NavLink } from "react-router-dom";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import testIcon from "../../assets/images/sidebar/taskSearch.png";
import assessIcon from "../../assets/images/sidebar/analytics.png";
import medsIcon from "../../assets/images/sidebar/care.png";
import apptIcon from "../../assets/images/sidebar/calender.png";
import learnIcon from "../../assets/images/sidebar/instruction.png";
import docDashBoardIcon from "../../assets/images/sidebar/docDashboardIcon.png";
import docRulesIcon from "../../assets/images/sidebar/docRulesIcon.png";
import { useSelector } from "react-redux";

export const GetSideBar = () => {
  const { userAuth } = useSelector((state) => state.authentication);

  if (userAuth.role === "SuperAdmin") {
    return (
      <>
        <ul
          className="navbar-nav sidebar sidebar-light accordion"
          id="accordionSidebar"
        >
          <NavLink
            className="sidebar-brand d-flex align-items-center justify-content-center"
            to="/"
          >
            <div className="sidebar-brand-text  mx-3">
              <NavLink className="text-white" to="/">
                <img
                  src={fertilityImage}
                  alt="logo"
                  style={{ width: "100%" }}
                />
              </NavLink>
            </div>
          </NavLink>

          {/* Divider */}
          <hr className="sidebar-divider my-0" />

          {/* empty */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/"></NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              <img
                src={docDashBoardIcon}
                alt="dashboard"
                style={{ width: "35px" }}
              ></img>
              <span className="pl-2">Dashboard</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/preview-Link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="30"
                fill=""
                class="bi bi-link-45deg"
                viewBox="0 0 16 16"
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
              </svg>
              <span className="pl-2">Preview Links</span>
            </NavLink>
          </li>

          {/* Nav Item - Add Company Collapse Menu */}
          {userAuth && !userAuth.companyName ? (
            <>
              <li className="nav-item d-none">
                <a
                  className="nav-link collapsed"
                  href="/"
                  data-toggle="collapse"
                  data-target="#collapseMCompany"
                  aria-expanded="true"
                  aria-controls="collapseMCompany"
                >
                  <i className="fas fa-fw fa-university"></i>
                  <span>Manage Compnay</span>
                </a>
                <div
                  id="collapseMCompany"
                  className="collapse"
                  aria-labelledby="headingMCompany"
                  data-parent="#accordionSidebar"
                >
                  <div className="bg-white py-2 collapse-inner rounded">
                    <NavLink className="collapse-item" to="add-company">
                      Add Company
                    </NavLink>
                    <div className="collapse-divider"></div>
                    <NavLink className="collapse-item" to="company-list">
                      Company List
                    </NavLink>
                  </div>
                </div>
              </li>
            </>
          ) : (
            ""
          )}

          <hr className="sidebar-divider d-none d-md-block" />

          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
            ></button>
          </div>
        </ul>
      </>
    );
  } else if (userAuth.role === "Doctor" || userAuth.role === "Coach") {
    return (
      <>
        <ul
          className="navbar-nav sidebar sidebar-light accordion"
          id="accordionSidebar"
        >
          {/* Sidebar - Brand */}
          <NavLink
            className="sidebar-brand d-flex align-items-center justify-content-center"
            to="/"
          >
            <div className="sidebar-brand-text  mx-3">
              <NavLink className="text-white" to="/">
                <img
                  src={fertilityImage}
                  alt="logo"
                  style={{ width: "100%" }}
                />
                {/* My Fertility */}
              </NavLink>
            </div>
          </NavLink>

          {/* Divider */}
          <hr className="sidebar-divider my-0" />

          {/* empty */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              {/*<i className="bi bi-microsoft"></i>
              <span>Dashboard</span> */}
            </NavLink>
          </li>

          {/* Nav Item - Dashboard */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              <img
                src={docDashBoardIcon}
                alt="dashboard"
                style={{ width: "35px" }}
              ></img>
              <span className="pl-2">Dashboard</span>
            </NavLink>
          </li>

          {/* Divider */}
          {/* <hr className="sidebar-divider" /> */}

          {/* Nav Item - Tests Collapse Menu */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/rules">
              <img
                src={docRulesIcon}
                alt="docRules"
                style={{ width: "40px" }}
              ></img>
              <span className="pl-2">Rules</span>
            </NavLink>
          </li>

          {/* Nav Item - APPT Collapse Menu */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/appointment">
              <img src={apptIcon} alt="test" style={{ width: "35px" }}></img>
              <span className="pl-2">Calendar</span>
            </NavLink>
          </li>

          {/* Nav Item - Add Company Collapse Menu */}
          {userAuth && !userAuth.companyName ? (
            <>
              <li className="nav-item d-none">
                <a
                  className="nav-link collapsed"
                  href="/"
                  data-toggle="collapse"
                  data-target="#collapseMCompany"
                  aria-expanded="true"
                  aria-controls="collapseMCompany"
                >
                  <i className="fas fa-fw fa-university"></i>
                  <span>Manage Compnay</span>
                </a>
                <div
                  id="collapseMCompany"
                  className="collapse"
                  aria-labelledby="headingMCompany"
                  data-parent="#accordionSidebar"
                >
                  <div className="bg-white py-2 collapse-inner rounded">
                    <NavLink className="collapse-item" to="add-company">
                      Add Company
                    </NavLink>
                    <div className="collapse-divider"></div>
                    <NavLink className="collapse-item" to="company-list">
                      Company List
                    </NavLink>
                  </div>
                </div>
              </li>
            </>
          ) : (
            ""
          )}

          {/* Divider */}
          <hr className="sidebar-divider d-none d-md-block" />

          {/* Sidebar Toggler (Sidebar) */}
          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
            ></button>
          </div>
        </ul>
      </>
    );
  } else if (userAuth.role === "Patient") {
    return (
      <>
        <ul
          className="navbar-nav sidebar sidebar-light accordion"
          id="accordionSidebar"
        >
          {/* Sidebar - Brand */}
          <NavLink
            className="sidebar-brand d-flex align-items-center justify-content-center"
            to="/"
          >
            {/* <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div> */}
            <div className="sidebar-brand-text  mx-3">
              <NavLink className="text-white" to="/">
                <img
                  src={fertilityImage}
                  alt="logo"
                  style={{ width: "100%" }}
                />
                {/* My Fertility */}
              </NavLink>
            </div>
          </NavLink>

          {/* Divider */}
          <hr className="sidebar-divider my-0" />

          {/* Nav Item - Dashboard */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              {/*<i className="fas fa-fw fa-tachometer-alt"></i>
             <span>Dashboard</span> */}
            </NavLink>
          </li>

          {/* Divider */}
          {/* <hr className="sidebar-divider" /> */}

          {/* Nav Item - Tests Collapse Menu */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              <img src={testIcon} alt="test" style={{ width: "35px" }}></img>
              <span className="pl-2">TESTS</span>
            </NavLink>
          </li>

          {/* Nav Item - ASSESS Collapse Menu */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/assessment">
              <img src={assessIcon} alt="test" style={{ width: "35px" }}></img>
              <span className="pl-2">ASSESS</span>
            </NavLink>
          </li>

          {/* Nav Item - MEDS Collapse Menu */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/medication">
              <img src={medsIcon} alt="test" style={{ width: "35px" }}></img>
              <span className="pl-2">MEDS</span>
            </NavLink>
          </li>

          {/* Nav Item - APPT Collapse Menu */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/appointment">
              <img src={apptIcon} alt="test" style={{ width: "35px" }}></img>
              <span className="pl-2">APPT</span>
            </NavLink>
          </li>

          {/* Nav Item - LEARN Collapse Menu */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/learn">
              <img src={learnIcon} alt="test" style={{ width: "35px" }}></img>
              <span className="pl-2">LEARN</span>
            </NavLink>
          </li>

          {/* Heading */}
          {/* <div className="sidebar-heading">Addons</div> */}

          {/* Nav Item - Add Company Collapse Menu */}
          {userAuth && !userAuth.companyName ? (
            <>
              <li className="nav-item d-none">
                <a
                  className="nav-link collapsed"
                  href="/"
                  data-toggle="collapse"
                  data-target="#collapseMCompany"
                  aria-expanded="true"
                  aria-controls="collapseMCompany"
                >
                  <i className="fas fa-fw fa-university"></i>
                  <span>Manage Compnay</span>
                </a>
                <div
                  id="collapseMCompany"
                  className="collapse"
                  aria-labelledby="headingMCompany"
                  data-parent="#accordionSidebar"
                >
                  <div className="bg-white py-2 collapse-inner rounded">
                    <NavLink className="collapse-item" to="add-company">
                      Add Company
                    </NavLink>
                    <div className="collapse-divider"></div>
                    <NavLink className="collapse-item" to="company-list">
                      Company List
                    </NavLink>
                  </div>
                </div>
              </li>
            </>
          ) : (
            ""
          )}

          {/* Divider */}
          <hr className="sidebar-divider d-none d-md-block" />

          {/* Sidebar Toggler (Sidebar) */}
          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
            ></button>
          </div>
        </ul>
      </>
    );
  } else {
    return (
      <>
        <ul
          className="navbar-nav sidebar sidebar-light accordion"
          id="accordionSidebar"
        >
          {/* Sidebar - Brand */}
          <NavLink
            className="sidebar-brand d-flex align-items-center justify-content-center"
            to="/"
          >
            <div className="sidebar-brand-text  mx-3">
              <NavLink className="text-white" to="/">
                <img
                  src={fertilityImage}
                  alt="logo"
                  style={{ width: "100%" }}
                />
                {/* My Fertility */}
              </NavLink>
            </div>
          </NavLink>

          {/* Divider */}
          <hr className="sidebar-divider my-0" />

          {/* empty */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/"></NavLink>
          </li>

          {/* Nav Item - Dashboard */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              <img
                src={docDashBoardIcon}
                alt="dashboard"
                style={{ width: "35px" }}
              ></img>
              <span className="pl-2">Dashboard</span>
            </NavLink>
          </li>

          {/* Nav Item - Add Company Collapse Menu */}
          {userAuth && !userAuth.companyName ? (
            <>
              <li className="nav-item d-none">
                <a
                  className="nav-link collapsed"
                  href="/"
                  data-toggle="collapse"
                  data-target="#collapseMCompany"
                  aria-expanded="true"
                  aria-controls="collapseMCompany"
                >
                  <i className="fas fa-fw fa-university"></i>
                  <span>Manage Compnay</span>
                </a>
                <div
                  id="collapseMCompany"
                  className="collapse"
                  aria-labelledby="headingMCompany"
                  data-parent="#accordionSidebar"
                >
                  <div className="bg-white py-2 collapse-inner rounded">
                    <NavLink className="collapse-item" to="add-company">
                      Add Company
                    </NavLink>
                    <div className="collapse-divider"></div>
                    <NavLink className="collapse-item" to="company-list">
                      Company List
                    </NavLink>
                  </div>
                </div>
              </li>
            </>
          ) : (
            ""
          )}

          {/* Divider */}
          <hr className="sidebar-divider d-none d-md-block" />

          {/* Sidebar Toggler (Sidebar) */}
          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
            ></button>
          </div>
        </ul>
      </>
    );
  }
};
