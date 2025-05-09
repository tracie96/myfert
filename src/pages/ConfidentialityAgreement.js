import React from 'react';
import { Row, Col } from 'antd';
import { NavLink } from 'react-router-dom';
import fertilityImage from '../assets/images/auth/fertilityImage.svg';

const ConfidentialityAgreement = () => {
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
                        <h4>Confidentiality Agreement and Oath of Confidentiality</h4>
                        <p>
                          This agreement applies to all individuals providing patient care or support services through My
                          Fertility Labs, including but not limited to clinicians, fertility coaches, nutritionists and allied
                          health professionals. The Provider acknowledges their receipt, understanding, and agreement
                          to adhere to the confidentiality obligations outlined below.
                        </p>

                        <h5>Oath of Confidentiality</h5>
                        <p>
                          By signing up as a care provider with My Fertility Labs, I acknowledge that I am entrusted with
                          access to sensitive and personal patient health information as part of my role at MFL.
                        </p>
                        <p>
                          I understand that confidentiality is fundamental to patient trust and ethical healthcare
                          practice. I solemnly swear and commit to the following:
                        </p>
                        <ul>
                          <li>I will uphold the highest standards of confidentiality, integrity, and professionalism
                          in handling patient health information.</li>
                          <li>I will only access, use, and disclose patient health information as required for my
                          professional duties and in full compliance with:
                            <ul>
                              <li>The Health Information Act (HIA);</li>
                              <li>The Personal Information Protection and Electronic Documents Act (PIPEDA);</li>
                              <li>Any other privacy laws applicable within my jurisdiction of practice.</li>
                            </ul>
                          </li>
                          <li>I will safeguard patient information against unauthorized access, loss, or disclosure.</li>
                          <li>I will immediately report any unauthorized access or suspected data breaches in
                          accordance with MFL's policies and regulatory obligations.</li>
                          <li>I understand that any violation of this oath may result in disciplinary action,
                          termination, legal consequences, and/or professional sanctions.</li>
                        </ul>

                        <h5>1. Confidentiality of Health Information</h5>
                        <p>
                          The Provider must protect and maintain the confidentiality of all patient health information in full
                          compliance with HIA, PIPEDA, and any other privacy legislation applicable to their jurisdiction.
                        </p>
                        <p>
                          As an authorized affiliate of MFL, which operates as a custodian under HIA, the Provider
                          shall only access, collect, use, and disclose the minimum necessary patient information
                          required to fulfill their professional duties.
                        </p>

                        <h5>2. Restrictions on Access and Disclosure</h5>
                        <p>
                          The Provider must prevent unauthorized access, use, or disclosure of patient health
                          information. Patient data may only be disclosed under the following circumstances:
                        </p>
                        <ul>
                          <li>As required by law (e.g., court orders, public health reporting, law enforcement
                          investigations);</li>
                          <li>With explicit written patient consent; or</li>
                          <li>For patient care and continuity of care, as permitted under HIA (e.g., disclosure to
                          another custodian, such as a referring physician or laboratory).</li>
                        </ul>
                        <p>
                          The Provider is strictly prohibited from using patient data for personal or third-party
                          purposes, including research, marketing, or analytics, unless explicitly authorized in writing by
                          MFL and permitted by law.
                        </p>

                        <h5>3. Breach Notification</h5>
                        <p>
                          The Provider must report any suspected or actual data breach immediately, including but not
                          limited to:
                        </p>
                        <ul>
                          <li>Unauthorized access (accidental or intentional viewing of patient records without valid
                          reason);</li>
                          <li>Unauthorized use or disclosure (sharing patient data without consent or legal
                          authority);</li>
                          <li>Loss or theft of patient data (including digital or physical records).</li>
                          <li>Suspicion that their account has been compromised (e.g., unauthorized login
                          attempts, unusual activity, or credential theft).</li>
                        </ul>

                        <h6>Reporting Requirements:</h6>
                        <ul>
                          <li>Breaches must be reported no later than 24 hours after discovery to the MFL Privacy
                          Officer at privacy@myfertilitylabs.com.</li>
                          <li>MFL may be required to report certain breaches to regulatory authorities in accordance
                          with HIA and PIPEDA.</li>
                        </ul>

                        <p>The breach report must include:</p>
                        <ol>
                          <li>A description of the breach (what happened and how it was detected);</li>
                          <li>The affected data (types of information involved and impacted individuals, if known);</li>
                          <li>Remedial actions taken or further actions required to contain and mitigate the breach.</li>
                        </ol>

                        <p>
                          The Provider must document all steps taken to investigate, mitigate, and remediate the breach
                          in compliance with HIA and PIPEDA requirements.
                        </p>

                        <h5>4. Audit and Monitoring</h5>
                        <ul>
                          <li>All access to patient information is logged and subject to real-time and
                          retrospective audits to ensure compliance with privacy and security laws.</li>
                          <li>MFL reserves the right to review, monitor, and investigate all Provider access to
                          patient records.</li>
                          <li>Unauthorized access may result in disciplinary action, termination of this
                          Agreement, and legal or regulatory penalties.</li>
                          <li>Storage & Data Transfers: All patient data will be stored within Canada unless
                          otherwise specified. If MFL transfers data outside Canada, it will do so in compliance
                          with HIA and PIPEDA requirements, ensuring appropriate safeguards are in place.</li>
                        </ul>

                        <h5>5. Data Retention and Deletion</h5>
                        <p>
                          The Provider acknowledges that MFL's system administrators manage the storage,
                          retention, and deletion of patient data in full compliance with HIA and PIPEDA.
                        </p>

                        <h6>Retention:</h6>
                        <ul>
                          <li>Patient records shall be retained for a minimum of 10 years from the date of the last
                          patient interaction, as required by HIA.</li>
                        </ul>

                        <h6>Deletion:</h6>
                        <ul>
                          <li>The Provider must not attempt to delete or remove any patient data from MFL's
                          system unless explicitly authorized in writing by MFL and in accordance with legally
                          mandated retention schedules.</li>
                        </ul>

                        <h6>Amendments to Patient Records:</h6>
                        <ul>
                          <li>Patients have the right to request corrections to their health information under HIA.
                          The Provider must process such requests in accordance with MFL's policies and
                          provide a written response within 30 days.</li>
                          <li>Providers may only modify patient data to correct or clarify health information based
                          on written or spoken patient reports, in compliance with HIA and PIPEDA.</li>
                          <li>Changes must:
                            <ul>
                              <li>Be necessary for accuracy and based on patient-provided information.</li>
                              <li>Be recorded as amendments without deleting prior entries.</li>
                              <li>Be documented per MFL policies.</li>
                            </ul>
                          </li>
                        </ul>

                        <h5>6. Ongoing Compliance and Legal Consequences</h5>
                        <ul>
                          <li>Throughout the term of this Agreement, the Provider must comply with all MFL
                          privacy policies, professional regulatory requirements, and legal obligations
                          related to patient information.</li>
                          <li>If the Provider continues to access or handle patient data after termination (e.g.,
                          for record transfers or outstanding obligations), they remain bound by this
                          confidentiality agreement.</li>
                        </ul>

                        <h6>Legal & Disciplinary Consequences for Violations:</h6>
                        <ul>
                          <li>Disciplinary action under MFL policies.</li>
                          <li>Immediate termination of this Agreement.</li>
                          <li>Legal or regulatory penalties, including fines and mandatory breach reporting under
                          HIA and PIPEDA.</li>
                          <li>Potential professional discipline by the Provider's regulatory body.</li>
                        </ul>

                        <p>
                          These confidentiality obligations remain in effect indefinitely, including after the
                          termination of this Agreement.
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

export default ConfidentialityAgreement; 