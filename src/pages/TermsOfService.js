import React from 'react';
import { Row, Col } from 'antd';
import { NavLink } from 'react-router-dom';
import fertilityImage from '../assets/images/auth/fertilityImage.svg';

const TermsOfService = () => {
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
                        <h4>My Fertility Labs Terms of Service</h4>
                        <p><strong>Effective Date: August 16, 2024</strong></p>
                        
                        <h5>Introduction</h5>
                        <p>Welcome to My Fertility Labs, Inc. ("My Fertility Labs," "we," "our," or "us"). These Terms of Service ("Terms") govern your use of our services including our platform, websites, and mobile applications ("Services"). By accessing or using our Services, you agree to these Terms. If you do not agree to these Terms, please do not use our Services.</p>

                        <h5>1. Use of the Services</h5>
                        <h6>1.1 Eligibility</h6>
                        <p>You must be at least 18 years old to use our Services. By using the Services, you confirm that you meet this age requirement.</p>

                        <h6>1.2 Account Registration</h6>
                        <p>To access certain features, you may need to create an account. You agree to provide accurate information and maintain the confidentiality of your credentials. You are responsible for all activities under your account.</p>

                        <h6>1.3 Delete Account</h6>
                        <p>You may delete your account at any time in your account settings. After pressing "Delete" you will need to confirm you want to delete your account. You will be notified that your account will be put into cold storage records and your account will be deleted. Once confirming, you will no longer have access to your account. Your data will be retained for 1 month and then you will receive a warning email a few days before it would move into cold storage asking if they are sure they want to delete their account and mention health data will move into cold storage following regulatory guidelines for the jurisdiction.</p>
                        <p>You may request that My Fertility Labs confidentially delete your information by contacting My Fertility Labs at privacy@myfertilitylabs.com. My Fertility Labs will delete your information unless we are required by law to retain the information. For more information also see My Fertility Labs Privacy Policy.</p>

                        <h5>2. Privacy</h5>
                        <p>Our use of your data, including health-related information, is governed by our Privacy Policy. By using the Services, you consent to our data practices as described in that Policy.</p>

                        <h5>3. Health-Related Services</h5>
                        <h6>3.1 Role of My Fertility Labs</h6>
                        <p>My Fertility Labs is a platform that connects patients with independent healthcare providers, including doctors, nurse practitioners, pharmacists, nutritionists, and fertility support practitioners. My Fertility Labs itself does not provide medical advice, diagnosis, or treatment. Instead, it facilitates the telehealth connection between patients and healthcare providers.</p>

                        <h6>3.2 Services Provided by Healthcare Providers</h6>
                        <p>Healthcare providers on our platform offer telehealth services, including diagnosis, treatment, and support within their professional scope and judgment. Providers include:</p>
                        <ul>
                          <li>Doctors and Nurse Practitioners: Diagnosing and treating medical conditions.</li>
                          <li>Pharmacists: Collaborating with physicians and other healthcare providers to provide care within their scope.</li>
                          <li>Nutritionists and Nutritional Practitioners: Offering dietary and supplement recommendations.</li>
                          <li>Fertility Support Practitioners and Fertility Educators: Providing education and emotional support.</li>
                        </ul>

                        <h6>3.3 Patient Responsibilities</h6>
                        <p>Patients should maintain regular checkups with their family physician and collaborate on any treatment plans initiated through My Fertility Labs. Our platform is designed to complement your ongoing healthcare, not replace it.</p>

                        <h6>3.4 Liability and Limitations</h6>
                        <p>My Fertility Labs does not control healthcare providers' clinical decisions. All medical advice and treatment are the sole responsibility of the individual providers. My Fertility Labs is not liable for any medical decisions or actions taken by these providers.</p>

                        <h6>3.5 Use of Anonymized Data for Research and AI</h6>
                        <p>By using our Services, you consent to the use of your anonymized health data for clinical and internal research, clinician training, product development, and AI innovation aimed at enhancing healthcare services. This data is used exclusively to advance reproductive health research and improve patient outcomes. All data used in this manner will be anonymized to ensure it cannot be linked back to you personally.</p>

                        <h5>4. User Conduct</h5>
                        <h6>4.1 Prohibited Conduct</h6>
                        <p>You agree not to:</p>
                        <ul>
                          <li>Engage in unlawful activities.</li>
                          <li>Infringe upon intellectual property rights.</li>
                          <li>Transmit harmful software.</li>
                          <li>Falsify health data or share prescription information with unauthorized persons.</li>
                          <li>Interfere with the Services' operation or networks.</li>
                        </ul>

                        <h5>5. Intellectual Property</h5>
                        <h6>5.1 Ownership</h6>
                        <p>All content, features, and functionality within the Services, including but not limited to software, text, graphics, logos, icons, audio, video, and the design, selection processes, patient flow, care plans, support tools, algorithms, artificial intelligence, and the arrangement and presentation of these elements, are owned by My Fertility Labs and are protected by intellectual property laws.</p>

                        <h6>5.2 Restrictions</h6>
                        <p>Except as expressly authorized in writing by My Fertility Labs, you may not:</p>
                        <ul>
                          <li>Copy, reproduce, republish, upload, post, transmit, distribute, modify, or create derivative works of the Services or any content therein;</li>
                          <li>Use any trademarks, logos, or service marks displayed on the Services;</li>
                          <li>Disassemble, decompile, reverse engineer, or otherwise attempt to derive source code from any software on the Services;</li>
                          <li>Use the Services or any content for commercial purposes without a license.</li>
                        </ul>

                        <h5>6. Limitation of Liability</h5>
                        <p>To the fullest extent permitted by law, My Fertility Labs is not liable for indirect, incidental, special, or consequential damages arising from your use of the Services.</p>

                        <h5>7. Dispute Resolution</h5>
                        <h6>7.1 Arbitration Agreement</h6>
                        <p>You and My Fertility Labs agree to resolve disputes through binding arbitration in Edmonton, Alberta, Canada, under the Alberta Arbitration Act.</p>

                        <h6>7.2 Class Action Waiver</h6>
                        <p>Dispute resolution will be conducted on an individual basis, not as a class action.</p>

                        <h5>8. Changes to the Terms</h5>
                        <p>We may update these Terms occasionally. When we do, we will update the "Effective Date" at the top of this page. Continued use of the Services after changes implies acceptance of the new Terms.</p>

                        <h5>9. Termination</h5>
                        <p>We may terminate or suspend your access to the Services at any time, particularly in cases of violation of these Terms, illegal activity, or failure to comply with applicable laws. In most cases, we will provide reasonable notice before termination, except where immediate termination is necessary to comply with legal obligations or to protect the integrity of the Services. Upon termination, your rights under these Terms will cease immediately.</p>

                        <h5>10. Governing Law</h5>
                        <p>These Terms are governed by the laws of Alberta, Canada, without regard to conflict of laws principles.</p>

                        <h5>11. Contact Us</h5>
                        <p>For questions about these Terms, contact us at:</p>
                        <p>My Fertility Labs, Inc., PO Box 423 STN Main,<br/>
                        St. Albert, Alberta, T8N 7A2<br/>
                        Email: privacy@myfertilitylabs.com</p>

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

export default TermsOfService; 