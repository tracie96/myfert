import React from 'react';
import { Row, Col } from 'antd';
import { NavLink } from 'react-router-dom';
import fertilityImage from '../assets/images/auth/fertilityImage.svg';

const CollectionNotice = () => {
  return (
    <div className="full-width-container">
      <Row gutter={24} style={{ minHeight: "100vh" }}>
        <Col span={2} className="column-1" style={{ backgroundColor: "#EFD0BD" }}></Col>
        <Col span={20} className="column-2">
          <div className="form-scrollable">
            <div className="col-xl-9 col-lg-10 col-md-12">
              <nav className="navbar mt-3">
                <img
                  className="float-left"
                  src={fertilityImage}
                  alt="loginImage"
                  style={{ width: "150px" }}
                />
                <form className="d-flex" role="search">
                  <NavLink
                    to="/"
                    className="btn btn-primary btn-user btn-block"
                    style={{background:'#00ADEF', border:'none'}}
                  >
                    <span>Sign In</span>
                  </NavLink>
                </form>
              </nav>
              <div className="card o-hidden border-0 my-3">
                <div className="card-body p-5">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <h4>Notice of Collection of Health Information</h4>
                        
                        <p>
                          My Fertility Labs (MFL) is committed to protecting your personal health information. We collect,
                          use, and disclose your health information to provide you with fertility care services and comply
                          with legal obligations.
                        </p>

                        <h5>Your Rights</h5>
                        <p>
                          Patients have the right to access and correct their health information. For more information on
                          your privacy rights, contact the Privacy Officer, at privacy@myfertilitylabs.com, or refer to our
                          Privacy Policy.
                        </p>

                        <p>
                          Patients may withdraw or limit consent for specific uses of their health information by
                          contacting the Privacy Officer, at privacy@myfertilitylabs.com, subject to legal and regulatory
                          obligations.
                        </p>

                        <h5>Why We Collect Your Information</h5>
                        <ul>
                          <li>To provide diagnostics, treatment plans, and related health services.</li>
                          <li>Provide telehealth services, care related to general and reproductive health, and
                          personalized treatment plans.</li>
                          <li>To facilitate communication, billing, and scheduling.</li>
                          <li>To comply with legal and regulatory requirements.</li>
                        </ul>

                        <h5>Legal Authority for Collection</h5>
                        <ul>
                          <li>Health Information Act, Section 20(b): Collection for the provision of health services.</li>
                          <li>Health Information Act, Section 21(1)(a): Collection authorized for diagnostic and
                          treatment purposes.</li>
                        </ul>

                        <h5>Questions? Contact Us</h5>
                        <p>
                          If you have any questions about the collection of your health information, please contact:<br/>
                          Privacy Officer, privacy@myfertilitylabs.com
                        </p>

                        <p>
                          By proceeding with your registration, you confirm that you have read and understood this
                          notice.
                        </p>

                        <p className="text-center mt-4">© 2025 My Fertility Labs Inc. All rights reserved.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={2} className="column-3" style={{ backgroundColor: "#EFD0BD" }}></Col>
      </Row>
    </div>
  );
};

export default CollectionNotice; 