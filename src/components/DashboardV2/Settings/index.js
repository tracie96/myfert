import React, { useState } from "react";
import { Layout, Tabs, Typography, Card } from "antd";
import { Row, Col } from 'antd';
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";

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
          {/* <TabPane tab="Manage Subscriptions" key="1">
            <Content style={{ padding: "20px 0" }}>
              <Title level={5} style={{ color: "#3BA9F4" }}>What is Lorem Ipsum?</Title>
              <Text style={{ color: "#858796" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </Text>
            </Content>
          </TabPane> */}
          <TabPane tab="Collection Notice" key="2">
            <Content className="my-3">
              <Text style={{ color: "#000000", fontStyle: "italic" }}>
              <p className="font-bold"><b>Notice of Collection of Health Information</b></p>
              <div class="notice-container">
                  <p>
                    My Fertility Labs (MFL) is committed to protecting your personal health information.
                    We collect, use, and disclose your health information to provide you with fertility care services and comply with legal obligations.
                  </p>
                  <p>
                    Patients have the right to access and correct their health information. For more information on your privacy rights,
                    contact the Privacy Officer, at <a href="mailto:privacy@myfertilitylabs.com">privacy@myfertilitylabs.com</a>,
                    or refer to our Privacy Policy.
                  </p>
                  <p>
                    Patients may withdraw or limit consent for specific uses of their health information by contacting the Privacy Officer,
                    at <a href="mailto:privacy@myfertilitylabs.com">privacy@myfertilitylabs.com</a>, subject to legal and regulatory obligations.
                  </p>

                  <p>Why We Collect Your Information:</p>
                  <ul>
                    <li>To provide diagnostics, treatment plans, and related health services.</li>
                    <li>Provide telehealth services, care related to general and reproductive health, and personalized treatment plans.</li>
                    <li>To facilitate communication, billing, and scheduling.</li>
                    <li>To comply with legal and regulatory requirements.</li>
                  </ul>

                  <p>Legal Authority for Collection:</p>
                  <ul>
                    <li><em>Health Information Act, Section 20(b)</em>: Collection for the provision of health services.</li>
                    <li><em>Health Information Act, Section 21(1)(a)</em>: Collection authorized for diagnostic and treatment purposes.</li>
                  </ul>

                  <p>Questions? Contact Us:</p>
                  <p>
                    If you have any questions about the collection of your health information, please contact:
                  </p>
                  <p>
                    • Privacy Officer, <a href="mailto:privacy@myfertilitylabs.com">privacy@myfertilitylabs.com</a>
                  </p>

                  <p><em>By proceeding with your registration, you confirm that you have read and understood this notice.</em></p>

                  <footer>
                    <p>© 2025 My Fertility Labs Inc. All rights reserved.</p>
                  </footer>
                </div>  
              </Text>
            </Content>
          </TabPane>
          <TabPane tab="Terms of Use" key="4">
          <Content>
            <div className="form-scrollable">
              <div>
                <div className="card o-hidden border-0 my-3">
                  <div className="max-w-3xl mx-auto px-6 py-8  space-y-6">
                    <div className="space-y-2">
                      <p  style={{ color: "#000" }}><strong>Effective Date:</strong> August 16, 2024</p>
                    </div>

                    <section>
                      <p style={{ color: "#000" }}><b>Introduction</b></p>
                      <p>
                        Welcome to My Fertility Labs, Inc. ("My Fertility Labs," "we," "our," or "us"). These Terms of Service ("Terms")
                        govern your use of our services including our platform, websites, and mobile applications ("Services"). By
                        accessing or using our Services, you agree to these Terms. If you do not agree to these Terms, please do not use
                        our Services.
                      </p>
                    </section>

                    <section>
                      <p style={{ color: "#000" }}><b>1. Use of the Services</b></p>

                      <p style={{ color: "#000" }}><b>1.1 Eligibility</b></p>
                      <p>You must be at least 18 years old to use our Services. By using the Services, you confirm that you meet this age requirement.</p>

                      <p style={{ color: "#000" }}><b>1.2 Account Registration</b></p>
                      <p>To access certain features, you may need to create an account. You agree to provide accurate information and maintain the confidentiality of your credentials. You are responsible for all activities under your account.</p>

                      <p style={{ color: "#000" }}><b>1.3 Delete Account</b></p>
                      <p>You may delete your account at any time in your account settings. After pressing "Delete," you'll be asked to confirm. Your data will be retained for 1 month, after which you’ll receive a warning email before it moves into cold storage, in accordance with regulatory guidelines.</p>
                      <p>You may also request account deletion by contacting us at <a href="mailto:privacy@myfertilitylabs.com" className="text-blue-600 underline">privacy@myfertilitylabs.com</a>. We will comply unless legally required to retain data.</p>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>2. Privacy</b></p>
                      <p>Our use of your data, including health-related information, is governed by our Privacy Policy. By using the Services, you consent to our data practices as described in that Policy.</p>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>3. Health-Related Services</b></p>

                    <p style={{ color: "#000" }}><b>3.1 Role of My Fertility Labs</b></p>
                      <p>We connect patients with independent healthcare providers. We do not offer medical advice ourselves but facilitate telehealth services.</p>

                      <p style={{ color: "#000" }}><b>3.2 Services Provided by Healthcare Providers</b></p>
                      <p>Providers may include:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Doctors & Nurse Practitioners:</strong> Medical diagnosis and treatment.</li>
                        <li><strong>Pharmacists:</strong> Care collaboration with physicians.</li>
                        <li><strong>Nutritionists:</strong> Dietary and supplement recommendations.</li>
                        <li><strong>Fertility Support Practitioners:</strong> Education and emotional support.</li>
                      </ul>

                      <p style={{ color: "#000" }}><b>3.3 Patient Responsibilities</b></p>
                      <p>Patients should maintain care with their primary physician and treat our services as supplemental.</p>

                      <p style={{ color: "#000" }}><b>3.4 Liability and Limitations</b></p>
                      <p>We are not responsible for clinical decisions made by healthcare providers using our platform.</p>

                      <p style={{ color: "#000" }}><b>3.5 Use of Anonymized Data for Research and AI</b></p>
                      <p>By using our Services, you consent to anonymized health data being used for research, training, product development, and AI innovation—strictly without personally identifiable information.</p>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>4. User Conduct</b></p>
                    <p style={{ color: "#000" }}><b>4.1 Prohibited Conduct</b></p>
                      <p>You agree not to:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Engage in unlawful activities</li>
                        <li>Infringe on intellectual property</li>
                        <li>Transmit malware or harmful code</li>
                        <li>Falsify health data or prescriptions</li>
                        <li>Disrupt the service’s operations or networks</li>
                      </ul>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>5. Intellectual Property</b></p>

                    <p style={{ color: "#000" }}><b>5.1 Ownership</b></p>
                      <p>All content and functionality on our platform is owned by My Fertility Labs and protected by law.</p>

                      <p style={{ color: "#000" }}><b>5.2 Restrictions</b></p>
                      <p>You may not:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Copy, reproduce, or distribute content without permission</li>
                        <li>Use logos or trademarks without consent</li>
                        <li>Reverse engineer or disassemble our software</li>
                        <li>Use content for commercial purposes without a license</li>
                      </ul>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>6. Limitation of Liability</b></p>
                      <p>We are not liable for any indirect or consequential damages related to your use of our Services, to the extent permitted by law.</p>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>7. Dispute Resolution</b></p>

                    <p style={{ color: "#000" }}><b>7.1 Arbitration Agreement</b></p>
                      <p>All disputes will be resolved via binding arbitration in Edmonton, Alberta, under the Alberta Arbitration Act.</p>

                      <p style={{ color: "#000" }}><b>7.2 Class Action Waiver</b></p>
                      <p>Disputes must be resolved individually—not via class action lawsuits.</p>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>8. Changes to the Terms</b></p>
                      <p>We may update these Terms periodically. Continued use of our Services constitutes agreement to updated Terms.</p>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>9. Termination</b></p>
                      <p>We reserve the right to suspend or terminate accounts in cases of violations or legal obligations. Most terminations will be preceded by reasonable notice unless immediate action is required.</p>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>10. Governing Law</b></p>
                      <p>These Terms are governed by the laws of Alberta, Canada.</p>
                    </section>

                    <section>
                    <p style={{ color: "#000" }}><b>11. Contact Us</b></p>
                      <address className="not-italic">
                        My Fertility Labs, Inc.<br />
                        PO Box 423 STN Main,<br />
                        St. Albert, Alberta, T8N 7A2<br />
                        Email: <a href="mailto:privacy@myfertilitylabs.com" className="text-blue-600 underline">privacy@myfertilitylabs.com</a>
                      </address>
                    </section>

                    <footer className="pt-6 text-center text-sm text-gray-500 border-t">
                      © 2025 My Fertility Labs Inc. All rights reserved.
                    </footer>
                  </div>
                </div>
              </div>
            </div>
            </Content>
          </TabPane>
          <TabPane tab="Privacy Policy" key="3">
            <Content>
              <div className="form-scrollable my-3">
                <div className="space-y-6 py-6 bg-white rounded-xl shadow-md">
                <div className="space-y-2">
                      <p  style={{ color: "#000" }}><b>Effective Date:</b> August 16, 2024</p>
                    </div>

                  <section>
                    <p style={{ color: "#000" }}><b>Introduction</b></p>
                    <p>
                      At My Fertility Labs, Inc. ("My Fertility Labs," "we," "our," or "us"), your privacy is of paramount importance.
                      We are committed to protecting your personal and health-related information and ensuring it is handled with care.
                      This Privacy Policy ("Policy") outlines how we collect, use, disclose, and protect your information when you use our
                      services ("Services"), including our platform, websites, and mobile applications.
                    </p>
                    <p>
                      This Policy complies with applicable privacy laws in Canada and the United States, including PIPEDA, Alberta's HIA,
                      and other relevant legislation. By accessing or using our Services, you agree to this Policy. If you do not agree,
                      please discontinue use of our Services.
                    </p>
                  </section>

                  <section>
                    <p style={{ color: "#000" }}><b>1. Information We Collect</b></p>
                    <p>
                      We collect various types of information based on your interaction with our Services. Personal data will not be shared
                      or used without your explicit consent.
                    </p>

                    <div className="space-y-6 px-4 py-6 bg-white rounded-xl shadow-md">
                      {/* Section: Personal Information */}
                      <section>
                      <p style={{ color: "#000" }}><b>1.1 Personal Information</b></p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-800">
                          <li>
                            <strong>Identifiers:</strong> Name, address, telephone number, email address, date of birth.
                          </li>
                          <li>
                            <strong>Account Information:</strong> Login credentials and other account-related details, including personal health identifier number, sex, pronouns, partner name (for linked account), phone number, email, sex, pronouns, User ID, email, password, linked account email, information for 2 factor authentication.
                          </li>
                          <li>
                            <strong>Order Fulfillment Information:</strong> My Fertility Labs (MFL) does not retain your payment information. Instead, we securely transmit it to trusted third-party service providers who handle payment processing. MFL solely stores your address information for shipping fulfillment purposes.
                          </li>
                        </ul>
                      </section>

                      {/* Section: Health Information */}
                      <section>
                      <p style={{ color: "#000" }}><b>1.2 Health Information</b></p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-800">
                          <li>
                            <strong>Medical History and Symptoms:</strong> Details from patient intake forms, including medical history and current health concerns.
                          </li>
                          <li>
                            <strong>Test Results:</strong> Bloodwork, semen analysis, urine tests, and other diagnostic results.
                          </li>
                          <li>
                            <strong>Cycle Tracking Data:</strong> Information on menstrual cycles, ovulation, and fertility.
                          </li>
                          <li>
                            <strong>Biometric Data:</strong> General health-related measurements, such as height, weight, and other relevant health metrics.
                          </li>
                          <li>
                            <strong>Nutrition Journal:</strong> Dietary habits and food intake tracking.
                          </li>
                        </ul>
                      </section>
                    </div>


                    <article>
                    <p style={{ color: "#000" }}><b>1.3 Automatically Collected Data (Cookies)</b></p>
                      <ul className="list-disc pl-5">
                        <li>Device Information: IP address, browser, OS, location</li>
                        <li>Usage Data: Pages visited, session duration</li>
                      </ul>
                    </article>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>2. How We Use Your Information</b></p>
                    <ul className="list-disc pl-5">
                      <li>Deliver and manage healthcare services</li>
                      <li>Improve platform functionality</li>
                      <li>Send service updates and marketing (with consent)</li>
                      <li>Ensure legal and regulatory compliance</li>
                    </ul>

                    <p style={{ color: "#000" }}><b>2.1 Anonymized Data for Research and AI</b></p>
                    <p>
                      We may use de-identified health data for internal research, training, and AI development. This data complies with
                      PIPEDA, Alberta’s HIA, and is stripped of identifiable details to ensure privacy.
                    </p>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>3. How We Share Your Information</b></p>
                    <ul className="list-disc pl-5">
                      <li>With licensed healthcare providers within their scope of care</li>
                      <li>With trusted service providers under confidentiality agreements</li>
                      <li>For legal obligations or rights protection</li>
                      <li>As anonymized data for research, training, and platform improvement</li>
                    </ul>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>4. User Rights</b></p>
                    <ul className="list-disc pl-5">
                      <li>Access and correct your data</li>
                      <li>Request data deletion (where permitted)</li>
                      <li>Withdraw consent at any time</li>
                      <li>Request data portability</li>
                    </ul>
                    <p className="mt-2">
                      Contact: <a href="mailto:privacy@myfertilitylabs.com" className="text-blue-600 underline">privacy@myfertilitylabs.com</a>
                    </p>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>5. Data Protection and Security</b></p>
                    <ul className="list-disc pl-5">
                      <li>End-to-end encryption for sensitive data</li>
                      <li>Access control with MFA, role-based restrictions</li>
                      <li>Regular security audits and compliance reports</li>
                      <li>Audit logging of system access and activity</li>
                      <li>Localized data storage (Canada for CA users, US for US users)</li>
                      <li>Use of third-party services in compliance with laws</li>
                      <li>Timely breach notification procedures</li>
                      <li>Private video calls only</li>
                      <li>Azure compliance manager available (<a href="https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-hipaa-us" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Learn more</a>)</li>
                    </ul>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>6. Data Retention</b></p>
                    <p>
                      We retain personal data while Services are active. Health data is deleted securely after [insert duration].
                      Financial records are stored by third parties for at least 7 years post-payment.
                    </p>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>7. Cold Storage for Inactive Accounts</b></p>
                    <p>
                      Accounts inactive for 3+ months may be moved to cold storage. You can reactivate by renewing your plan.
                    </p>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>8. International Data Transfers</b></p>
                    <p>
                      Data is processed in Canada and the US. Any other transfers will comply with applicable laws.
                    </p>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>9. Updates to this Policy</b></p>
                    <p>
                      Policy updates will reflect changes in laws or practices. Users will be notified of updates.
                    </p>
                  </section>

                  <section>
                  <p style={{ color: "#000" }}><b>10. Contact Us</b></p>
                    <p>
                      <strong>My Fertility Labs, Inc.</strong><br />
                      PO Box 423 STN Main,<br />
                      St. Albert, Alberta, T8N 7A2<br />
                      Email: <a href="mailto:privacy@myfertilitylabs.com" className="text-blue-600 underline">privacy@myfertilitylabs.com</a>
                    </p>
                  </section>

                  <footer className="text-center text-sm text-gray-500 mt-6">
                    © 2025 My Fertility Labs Inc. All rights reserved.
                  </footer>
                </div>
              </div>
            </Content>
          </TabPane>
          
        </Tabs>
      </Card>
    </Layout>
  );
};

export default SettingsPage;
