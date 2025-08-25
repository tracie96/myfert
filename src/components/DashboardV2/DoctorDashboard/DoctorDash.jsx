import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Table, Card, message, Input, Modal, Button } from "antd";
import {
    SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getZohoClientID, patientList, linkDoctorToPatient, patientbyDoctor } from "../../redux/doctorSlice";
import { useNavigate } from "react-router-dom";
import { FaHospital } from "react-icons/fa";

// const SwitchWrapper = ({ onChange, ...props }) => {
//     const handleClick = (e) => {
//         e.stopPropagation();
//     };

//     return (
//         <div onClick={handleClick}>
//             <Switch {...props} onChange={onChange} />
//         </div>
//     );
// };

export default function DoctorDash() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("1");
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const loggedInUserId = useSelector(
        (state) => state?.authentication?.userAuth?.obj?.id,
    );

    const [allData, setAllData] = useState([]);

    //const [data, setData] = useState([]); // Data for the current page
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });
    const [sortConfig, setSortConfig] = useState({
        sortField: null,
        sortOrder: null,
    });
    const userAuth = useSelector(
        (state) => state?.authentication?.userAuth
    );


    const fetchPatientList = useCallback(async () => {
        setLoading(true);
        const params = {
            page: 0,
            size: 500,
            sortColumn: sortConfig.sortField,
            sortDirection: sortConfig.sortOrder,
        };

        try {
            let response;

            if (activeTab === "1") {
                response = await dispatch(patientList(params));
            } else {
                response = await dispatch(patientbyDoctor(loggedInUserId));
            }

            if (
                (activeTab === "1" && patientList.fulfilled.match(response)) ||
                (activeTab === "2" && patientbyDoctor.fulfilled.match(response))
            ) {
                const updatedList = response?.payload?.data?.map((item) => {
                    if (item && item.createdById === loggedInUserId) {
                        item.createdBy = "You";
                    }
                    return item;
                });

                setAllData(updatedList);
                setPagination((prev) => ({
                    ...prev,
                    total: updatedList?.length,
                }));
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            message.error("Error fetching patient list.");
        } finally {
            setLoading(false);
        }
    }, [dispatch, sortConfig.sortField, sortConfig.sortOrder, activeTab, loggedInUserId]);


    useEffect(() => {
        fetchPatientList();
    }, [fetchPatientList, activeTab]);


    useEffect(() => {
        dispatch(getZohoClientID()).then((response) => {
            if (getZohoClientID.fulfilled.match(response)) {
                console.log("Zoho Client Id-", response.payload);
                localStorage.setItem("zohoClientId", JSON.stringify(response.payload));
            } else {
                console.error("Failed to fetch the Zoho client Id-", response.error.message);
            }
        });
    }, [dispatch]);

    useEffect(() => {
        setPagination({
            current: 1,
            pageSize: 20,
            total: 0,
        });
        setSearchQuery(""); // optional: clear search too
    }, [activeTab]);
    

    const handleTableChange = useCallback((newPagination, filters, sorter) => {
        const { current, pageSize } = newPagination;

        setPagination((prev) => ({
            ...prev,
            current,
            pageSize,
        }));

        setSortConfig({
            sortField: sorter.field,
            sortOrder: sorter.order,
        });

        // Update the data displayed based on the new pagination
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        console.log({ endIndex })

        // setData(allData.slice(startIndex, endIndex));
    }, []);
    const handleSearch = useCallback((value) => {
        setSearchQuery(value);
    }, []);

    const dataWithIds = useMemo(
        () =>
            allData?.map((item) => ({
                ...item,
                id: item.id,
            })),
        [allData], // changed dependency to allData
    );

    const filteredData = useMemo(() => {
        if (!searchQuery) return dataWithIds;
        console.log({ dataWithIds })
        return dataWithIds.filter((item) =>
            item.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.flag && item.flag.toString().toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, dataWithIds]);

    const columns = useMemo(() => {
        const baseColumns = [
            {
                title: "First Name",
                dataIndex: "firstname",
                key: "firstname",
                sorter: true,
            },
            {
                title: "Last Name",
                dataIndex: "lastname",
                key: "lastname",
                sorter: true,
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                sorter: true,
                render: (email) => (
                    <div>
                        {email}
                    </div>
                ),
            },
            {
                title: "Clinician",
                dataIndex: "providers",
                key: "clinician",
                render: (providers) => {
                    if (!Array.isArray(providers) || providers.length === 0) return "-";

                    return (
                        <div>
                            {providers.map((provider, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                    <span>{provider.providerName}</span>

                                    {provider.statusRemark && (
                                        <span style={{ width: "12px", height: "12px", backgroundColor: provider.statusRemark.toLowerCase() === "approved" ? "#52c41a" : "#f5222d", borderRadius: "50%", display: "inline-block" }}></span>

                                    )}
                                </div>

                            ))}
                        </div>
                    );
                },
            },
        ];

        if (activeTab === "1") {
            baseColumns.push({
                title: "Assigned to me",
                dataIndex: "assignedToMe",
                key: "assignedToMe",
                render: (_, record) => {
                    const providers = Array.isArray(record.providers) ? record.providers : [];
                    const fullName = `${userAuth?.obj?.firstName} ${userAuth?.obj?.lastName}`;

                    const isAssignedToMe = providers.some(
                        (provider) => provider?.providerName === fullName
                    );

                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                                className="isAssignBtn ant-btn css-dev-only-do-not-override-f7vrd6 ant-btn-primary"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        const payload = {
                                            patientRef: record.userRef,
                                            link: !isAssignedToMe,  // false if already assigned (Un-Assign), true otherwise
                                        };
                                
                                        await dispatch(linkDoctorToPatient(payload));
                                        message.success(`Patient ${isAssignedToMe ? "unassigned" : "assigned"} successfully.`);
                                        await fetchPatientList();
                                
                                        setAllData((prevData) =>
                                            prevData.map((item) =>
                                                item.userRef === record.userRef
                                                    ? {
                                                        ...item,
                                                        providers: !isAssignedToMe
                                                            ? [
                                                                ...(item.providers || []).filter(
                                                                    (provider) => provider.providerName !== fullName
                                                                ),
                                                                {
                                                                    userRef: loggedInUserId,
                                                                    providerName: fullName,
                                                                    status: 0,
                                                                    statusRemark: "Pending",
                                                                },
                                                            ]
                                                            : (item.providers || []).filter(
                                                                (provider) => provider.providerName !== fullName
                                                            ),
                                                    }
                                                    : item
                                            )
                                        );
                                
                                    } catch (error) {
                                        console.error(error);
                                        message.error(`Failed to ${isAssignedToMe ? "unassign" : "assign"} patient.`);
                                    }
                                }}
                                
                            >
                                {isAssignedToMe ? "Un-Assign" : "Assign"}
                            </button>
                        </div>
                    );
                },
            });
        }


        return baseColumns;
    }, [activeTab, dispatch, loggedInUserId, fetchPatientList, userAuth?.obj?.firstName, userAuth?.obj?.lastName]);



    // Function to check if a patient is assigned to the current doctor
    const isPatientAssignedToMe = useCallback((patient) => {
        const providers = Array.isArray(patient.providers) ? patient.providers : [];
        const fullName = `${userAuth?.obj?.firstName} ${userAuth?.obj?.lastName}`;
        return providers.some(
            (provider) => provider?.providerName === fullName
        );
    }, [userAuth?.obj?.firstName, userAuth?.obj?.lastName]);

    // Function to handle patient row click
    const handlePatientRowClick = useCallback((record) => {
        if (activeTab === "2") {
            // For "Assigned to me" tab, allow navigation
            localStorage.setItem("patient", JSON.stringify(record));
            navigate(`/doctor/user/${record.userRef}`, {
                state: { user: record },
            });
        } else {
            // For "All Patients" tab, check assignment
            if (isPatientAssignedToMe(record)) {
                // Patient is assigned, allow navigation
                localStorage.setItem("patient", JSON.stringify(record));
                navigate(`/doctor/user/${record.userRef}`, {
                    state: { user: record },
                });
            } else {
                // Patient is not assigned, show modal
                setSelectedPatient(record);
                setShowAssignmentModal(true);
            }
        }
    }, [activeTab, navigate, isPatientAssignedToMe]);

    const PatientList = React.memo(
        () => (
            <>
                <div className="status-indicators">
                    <div className="status-item">
                        <span className="status-dot approved"></span>
                        <span>Approved</span>
                    </div>
                    <div className="status-item">
                        <span className="status-dot pending"></span>
                        <span>Pending</span>
                    </div>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredData?.slice(
                            (pagination.current - 1) * pagination.pageSize,
                            pagination.current * pagination.pageSize
                        )}

                        loading={loading}
                        // scroll={{ x: "max-content" }}
                        pagination={{
                            position: ['bottomRight'],
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                        }}
                        onChange={handleTableChange}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        onRow={(record) => ({
                            onClick: (e) => {
                                if (!e.target.closest(".isAssignBtn")) {
                                    handlePatientRowClick(record);
                                }
                            },
                        })}
                        
                    />
                </Card>
            </>
        ),
        [columns, filteredData, loading, handleTableChange, navigate, pagination, handlePatientRowClick],
    );

    const items = [
        {
            label: "All Patients",
            key: "1",
            children: <PatientList />,
        },
        {
            label: "Assigned to me",
            key: "2",
            children: <PatientList />,
        },
    ];

    return (
        <Row gutter={16} style={{ padding: "0 5%" }}>
            <Col xs={24} md={24} style={{ paddingBottom: "16px" }}>
                <p style={{ color: "#335CAD", fontWeight: "bold", fontSize: "16px" }}>
                    Patient List
                </p>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        setSearchQuery(""); // Optional: reset search when changing tabs
                    }}
                    items={items}
                    tabBarExtraContent={
                        <div style={{ marginBottom: 16 }}>
                            <Input
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                prefix={<SearchOutlined />}
                            />
                        </div>
                    }
                />

            </Col>

            {/* Assignment Required Modal */}
            <Modal
                title={null}
                open={showAssignmentModal}
                onCancel={() => setShowAssignmentModal(false)}
                footer={null}
                width={600}
                centered
                closable={false}
                maskClosable={false}
            >
                <div style={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(51, 92, 173, 0.08)',
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #00ADEF 0%, #01acee 100%)',
                        padding: '24px 32px',
                        textAlign: 'center',
                        position: 'relative',
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                        }}>
                            <span style={{ fontSize: '32px' }}><FaHospital style={{ color: '#fff' }} /></span>
                        </div>
                        
                        <h2 style={{
                            margin: 0,
                            color: '#fff',
                            fontSize: '24px',
                            fontWeight: '700',
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}>
                            Patient Assignment Required
                        </h2>
                    </div>
                    
                    {/* Content */}
                    <div style={{ padding: '32px' }}>
                        {/* Info Box */}
                        <div style={{
                            background: 'rgba(51, 92, 173, 0.05)',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '24px',
                            border: '1px solid rgba(51, 92, 173, 0.1)',
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '16px',
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    background: '#335CAD',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                }}>
                                    <span style={{ color: '#fff', fontSize: '12px' }}>ℹ️</span>
                                </div>
                                <span style={{
                                    color: '#335CAD',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                }}>
                                    Access Restricted
                                </span>
                            </div>
                            <p style={{
                                margin: 0,
                                color: '#666',
                                fontSize: '14px',
                                lineHeight: '1.5',
                            }}>
                                You cannot view the intake form of patients you aren't assigned to.
                            </p>
                        </div>
                        
                        {/* Steps */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{
                                margin: '0 0 16px 0',
                                color: '#222',
                                fontSize: '18px',
                                fontWeight: '600',
                            }}>
                                To access this patient's information:
                            </h3>
                            
                          
                            
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #E8F4FD',
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #335CAD 0%, #00ADEF 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '16px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}>
                                    1
                                </div>
                                <span style={{
                                    color: '#222',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                }}>
                                    Assign the patient to yourself
                                </span>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                        }}>
                            <Button
                                size="large"
                                onClick={() => setShowAssignmentModal(false)}
                                style={{
                                    padding: '12px 32px',
                                    borderRadius: '8px',
                                    border: '2px solid #E8F4FD',
                                    color: '#666',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                }}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => {
                                    setShowAssignmentModal(false);
                                    // Navigate to the patient and show the assign button
                                    if (selectedPatient) {
                                        localStorage.setItem("patient", JSON.stringify(selectedPatient));
                                        navigate(`/doctor/user/${selectedPatient.userRef}`, {
                                            state: { user: selectedPatient },
                                        });
                                    }
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #335CAD 0%, #00ADEF 100%)',
                                    border: 'none',
                                    padding: '12px 32px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    boxShadow: '0 4px 12px rgba(51, 92, 173, 0.3)',
                                }}
                            >
                                Go to Patient
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </Row>
    );
}
