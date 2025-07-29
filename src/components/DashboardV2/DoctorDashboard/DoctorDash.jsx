import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Table, Card, message, Input } from "antd";
import {
    SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getZohoClientID, patientList, linkDoctorToPatient, patientbyDoctor } from "../../redux/doctorSlice";
import { useNavigate } from "react-router-dom";

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
                    <div
                        style={{
                            maxWidth: "240px",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {email}
                    </div>
                ),
            },

            {
                title: "DOB",
                dataIndex: "dob",
                key: "dob",
                sorter: true,
                render: (dob) => dob ? new Date(dob).toLocaleDateString() : "-",
            },
            {
                title: "Country",
                dataIndex: "country",
                key: "country",
                sorter: true,
                render: (country) => country || "-",
            },
            {
                title: "City",  // <-- New City column
                dataIndex: "city",
                key: "city",
                sorter: true,
                render: (city) => city || "-",
            },
            {
                title: "Phone Number", // <-- New Phone Number column
                dataIndex: "phoneNumber",
                key: "phoneNumber",
                sorter: true,
                render: (phone) => phone || "-",
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
                                disabled={isAssignedToMe}
                                className="isAssignBtn ant-btn css-dev-only-do-not-override-f7vrd6 ant-btn-primary"
                                onClick={async (e) => {
                                    if (isAssignedToMe) return;

                                    e.stopPropagation();
                                    try {
                                        await dispatch(linkDoctorToPatient({ patientRef: record.userRef }));
                                        message.success("Patient assigned to you.");
                                        await fetchPatientList();

                                        setAllData((prevData) =>
                                            prevData.map((item) =>
                                                item.userRef === record.userRef
                                                    ? {
                                                        ...item,
                                                        providers: [
                                                            ...(item.providers || []),
                                                            {
                                                                userRef: loggedInUserId,
                                                                providerName: fullName,
                                                                status: 0,
                                                                statusRemark: "Pending",
                                                            },
                                                        ],
                                                    }
                                                    : item
                                            )
                                        );
                                    } catch (error) {
                                        console.error(error);
                                        message.error("Failed to assign patient.");
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
                    // onRow={(record) => ({
                    //     onClick: (e) => {
                    //         if (!e.target.closest(".ant-switch")) {
                    //             localStorage.setItem("patient", JSON.stringify(record));
                    //             navigate(`/doctor/user/${record.userRef}`, {
                    //                 state: { user: record },
                    //             });
                    //         }
                    //     },
                    // })}
                    />
                </Card>
            </>
        ),
        [columns, filteredData, loading, handleTableChange, navigate, pagination],
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
        </Row>
    );
}
