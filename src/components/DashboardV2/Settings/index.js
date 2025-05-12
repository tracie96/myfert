import React, { useState } from "react";
import { Layout, Tabs, Typography, Card } from "antd";
import { Row, Col } from 'antd';
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import { NavLink } from "react-router-dom";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Layout style={{ boxShadow: "none !important" }}>
      {/* Header Section */}
      {/* <Card style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "16px", fontWeight: "bold", color: "#3BA9F4" }}>{userEmail}</Text>
        </div>
      </Card> */}

      {/* Tabs Section */}
      <Card style={{ border: "none" }}>
        <Title level={4} style={{ marginBottom: "20px", color: "#4e73df" }}>
          SETTINGS
        </Title>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          tabBarStyle={{
            fontWeight: "bold",
            borderBottom: "2px solid #eaecf4",
          }}
        >
          <TabPane tab="Manage Subscriptions" key="1">
            <Content style={{ padding: "20px 0" }}>
              <Title level={5} style={{ color: "#3BA9F4" }}>What is Lorem Ipsum?</Title>
              <Text style={{ color: "#858796" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </Text>
            </Content>
          </TabPane>
          <TabPane tab="System Support" key="2">
            <Content style={{ padding: "20px 0" }}>
              <Text style={{ color: "#858796" }}>
                System support information will be displayed here. Add your content.
              </Text>
            </Content>
          </TabPane>
          <TabPane tab="Privacy Policy" key="3">
            <Content>
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
                              style={{ background: '#00ADEF', border: 'none' }}
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
                                  <h4>My Fertility Labs Privacy Policy</h4>
                                  <p><strong>Effective Date: August 16, 2024</strong></p>

                                  <h5>Introduction</h5>
                                  <p>
                                    At My Fertility Labs, Inc. ("My Fertility Labs," "we," "our," or "us"), your privacy is of paramount
                                    importance. We are committed to protecting your personal and health-related information and
                                    ensuring it is handled with the utmost care. This Privacy Policy ("Policy") outlines how we
                                    collect, use, disclose, and protect your information when you use our services ("Services"),
                                    including our platform, websites and mobile applications. Our goal is to provide transparency
                                    and give you peace of mind, knowing that your data is secure with us.
                                  </p>
                                  <p>
                                    This Policy complies with applicable privacy laws in Canada and the United States, including
                                    Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), Alberta's
                                    Health Information Act (HIA), and the laws of any Canadian provinces or US states in which My
                                    Fertility Lab's services are made available. By accessing or using our Services, you agree to
                                    this Policy. If you do not agree, please discontinue use of our Services.
                                  </p>

                                  <h5>1. Information We Collect</h5>
                                  <p>We collect various types of information about you, depending on how you interact with our
                                    Services. The personal data we collect will not be shared, utilized, or distributed without
                                    obtaining your explicit consent.</p>

                                  <h6>1.1 Personal Information</h6>
                                  <ul>
                                    <li>Identifiers: Name, address, telephone number, email address, date of birth.</li>
                                    <li>Account Information: Login credentials and other account-related details., including
                                      personal health identifier number, sex, pronouns, partner name (for linked account),
                                      phone number, email, sex, pronouns, User ID, email, password, linked account email,
                                      information for 2 factor authentication.</li>
                                    <li>Order Fulfillment Information: My Fertility Labs (MFL) does not retain your payment
                                      information. Instead, we securely transmit it to trusted third-party service providers who
                                      handle payment processing. MFL solely stores your address information for shipping
                                      fulfillment purposes.</li>
                                  </ul>

                                  <h6>1.2 Health Information</h6>
                                  <ul>
                                    <li>Medical History and Symptoms: Details from patient intake forms, including medical
                                      history and current health concerns.</li>
                                    <li>Test Results: Bloodwork, semen analysis, urine tests, and other diagnostic results.</li>
                                    <li>Cycle Tracking Data: Information on menstrual cycles, ovulation, and fertility.</li>
                                    <li>Biometric Data: General health-related measurements, such as height, weight, and
                                      other relevant health metrics.</li>
                                    <li>Nutrition Journal: Dietary habits and food intake tracking.</li>
                                  </ul>

                                  <h6>1.3 Automatically Collected Information - Cookies</h6>
                                  <ul>
                                    <li>Device Information: IP address, browser type, operating system, and general location.</li>
                                    <li>Usage Data: Interactions with our Services, including pages visited and time spent on
                                      each page.</li>
                                  </ul>

                                  <h5>2. How We Use Your Information</h5>
                                  <p>We use your information, including health-related data, to:</p>
                                  <ul>
                                    <li>Deliver and Manage Services: Facilitate healthcare services, process transactions, and
                                      manage your account.</li>
                                    <li>Enhance Our Services: Analyze usage data to improve functionality and quality.</li>
                                    <li>Communicate with You: Send updates, service notifications, and, where permitted,
                                      marketing communications.</li>
                                    <li>Legal Compliance: Ensure adherence to applicable laws and regulations, including
                                      responding to legal requests.</li>
                                  </ul>

                                  <h6>2.1 Anonymized Data for Research and AI Development</h6>
                                  <p>
                                    By using our Services, you acknowledge and agree that My Fertility Labs may use de-identified
                                    health data in accordance with applicable laws. This data is anonymized in compliance with the
                                    Health Information Act (Alberta), PIPEDA, and applicable privacy laws. Anonymized data is data
                                    that has been stripped of personally identifiable information, ensuring it cannot be traced back to
                                    you. Anonymized data may be used for clinical and internal research, training, product
                                    development, and AI innovation to improve reproductive health and patient outcomes.
                                  </p>

                                  <h5>3. How We Share Your Information</h5>
                                  <p>Your data is shared only as necessary and with your explicit consent:</p>
                                  <ul>
                                    <li>Healthcare Providers: Licensed providers on our platform may access your information
                                      to deliver healthcare services within their scope of practice.</li>
                                    <li>Service Providers: Trusted partners who assist in operating our Services (e.g.,
                                      payment processors) and are bound by confidentiality agreements.</li>
                                    <li>Legal Compliance: We may disclose information as required by law or to protect our
                                      legal rights.</li>
                                    <li>Anonymized data: My Fertility Labs may use de-identified health data—anonymized in
                                      accordance with applicable privacy laws—for purposes including clinician training,
                                      platform improvement, reproductive health research, and AI development. This data is
                                      used solely to enhance care quality, inform clinical practices, and support innovation in
                                      reproductive health.</li>
                                  </ul>

                                  <h5>4. User Rights</h5>
                                  <p>You have rights under applicable laws, including:</p>
                                  <ul>
                                    <li>Access and Correction: Request access to your data and correct any inaccuracies.</li>
                                    <li>Data Deletion: Request deletion of your data, subject to legal exceptions.</li>
                                    <li>Consent Withdrawal: Withdraw consent for data collection or sharing.</li>
                                    <li>Data Portability: Request a copy of your data in a portable format.</li>
                                  </ul>
                                  <p>
                                    To exercise these rights, contact us via our website's webform or email us at
                                    privacy@myfertilitylabs.com.
                                  </p>

                                  <h5>5. Data Protection and Security</h5>
                                  <p>We take your data security seriously:</p>
                                  <ul>
                                    <li>Encryption: We use encryption to protect sensitive data, both in transit and at rest,
                                      adhering to industry best practices.</li>
                                    <li>Access Control: Data access is restricted to authorized personnel, with multi-factor
                                      authentication in place. 2 factor authentication, data anonymization (for admin console
                                      user must be searched by ID or last name and selected before seeing only relevant
                                      patient data). Clinicians can only see patient data for patients in their care. Clinicians
                                      must transfer patient out of their care to another clinician before new clinician can see
                                      their data. Limited number of Admins for the application for higher security.</li>
                                    <li>Regular Audits: We conduct regular audits to ensure ongoing compliance with security
                                      standards. Certifications or compliance reports may be provided upon request.</li>
                                    <li>System Audit Logging: Logs of access to personal health information will include user
                                      identification and role, data and time of access, actions performed (e.g., viewing, editing,
                                      deleting), and identification of the record accessed.</li>
                                    <li>Data Storage: To minimize cross-border data transfers, Canadian user data will be
                                      stored within Canada, and US user data will be stored within the United States.</li>
                                    <li>Third Party Services: Any use of third-party services for data processing will comply
                                      with all applicable data protection regulations. Sub-processors involved will adhere to the
                                      same stringent data security requirements.</li>
                                    <li>Data Breach Response: In the event of a breach, we will notify affected individuals
                                      promptly, as required by law. Appropriate steps will be taken to mitigate the impact and
                                      reports will be filed with relevant authorities as required.</li>
                                    <li>Video Calls: Clinicians/patient must confirm that they are in a private location before
                                      videocall. We also have a physical location. Clinicians need to sign off on having a
                                      private office they can use or have access to a private access to address the privacy
                                      requirements. Our resources are required to only conduct their client sessions in private.</li>
                                    <li>Compliance Manager: Azure has a compliance manager built in. <a href="https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-hipaa-us" target="_blank" rel="noopener noreferrer">Learn more about Azure compliance</a></li>
                                  </ul>

                                  <h5>6. Data Retention</h5>
                                  <p>
                                    My Fertility Labs retains your personal information for as long as you are using our Services.
                                    Your health information will be kept for [state how long] after you stop using our Services and
                                    then will be completely and securely deleted. A record of your financial/payment information,
                                    collected by our third-party service provider, will be maintained for a minimum of 7 years after
                                    your last payment is made.
                                  </p>

                                  <h5>7. Cold Storage for Inactive User Accounts</h5>
                                  <p>
                                    My Fertility Labs may identify inactive user accounts (accounts inactive for three or more
                                    months) and move the data into cold storage. This ensures secure and efficient data handling
                                    while preserving user information. You may reactivate your account and restore access to your
                                    data if you renew your plan.
                                  </p>

                                  <h5>8. International Data Transfers</h5>
                                  <p>
                                    Data is stored and processed in Canada and the United States. If data transfer outside these
                                    jurisdictions is necessary, it will be done in compliance with applicable laws.
                                  </p>

                                  <h5>9. Updates to this Policy</h5>
                                  <p>
                                    We may update this Policy to reflect changes in our practices or legal requirements. The
                                    "Effective Date" will be updated accordingly. We will notify users of any changes to our privacy
                                    and security policies. Users are responsible for notifying us of changes to their own privacy
                                    requirements.
                                  </p>

                                  <h5>10. Contact Us</h5>
                                  <p>
                                    For any questions or concerns regarding this Policy, please contact us at:<br />
                                    My Fertility Labs, Inc.<br />
                                    PO Box 423 STN Main,<br />
                                    St. Albert, Alberta, T8N 7A2<br />
                                    Email: privacy@myfertilitylabs.com
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
            </Content>
          </TabPane>
          <TabPane tab="Terms of Use" key="4">
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
          </TabPane>
        </Tabs>
      </Card>
    </Layout>
  );
};

export default SettingsPage;
