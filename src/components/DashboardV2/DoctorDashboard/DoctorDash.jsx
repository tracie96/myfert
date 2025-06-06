import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Table, Card, message, Input } from "antd";
import {
    ExperimentOutlined,
    FlagTwoTone,
    QuestionCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getZohoClientID, patientList } from "../../redux/doctorSlice";
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
    const loggedInUserId = useSelector(
        (state) => state?.authentication?.userAuth?.obj?.id,
    );

    const [allData, setAllData] = useState([]); // Store all data fetched from the API
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

    const fetchPatientList = useCallback(async () => {
        setLoading(true);
        const params = {
            page: 1, // Fetch all data in one go
            size: 500, // Adjust the size accordingly to fetch all the data
            sortColumn: sortConfig.sortField,
            sortDirection: sortConfig.sortOrder,
        };

        try {
            const response = await dispatch(patientList(params));
            if (patientList.fulfilled.match(response)) {
                const updatedList = response?.payload?.data?.map((item) => {
                    if (item && item.createdById === loggedInUserId) {
                        item.createdBy = "You";
                    }
                    return item;
                });
                setAllData(updatedList); // Store all data
                setPagination((prev) => ({
                    ...prev,
                    total: updatedList?.length, // Set total from the fetched data
                }));
               // setData(updatedList?.slice(0, pagination.pageSize)); // Display the first page
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            message.error("Error fetching user list.");
        } finally {
            setLoading(false);
        }
    }, [
        dispatch,
        sortConfig.sortField,
        sortConfig.sortOrder,
        loggedInUserId,
    ]);

    useEffect(() => {
        fetchPatientList();
    }, [fetchPatientList]);

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
        console.log({endIndex})

       // setData(allData.slice(startIndex, endIndex));
    }, []);
    const handleSearch = useCallback((value) => {
        setSearchQuery(value);
    }, []);

    // const handleSwitchChange = useCallback(
    //     async (checked, record, step) => {
    //         console.log(record, "step");

    //         if (checked) {
    //             try {
    //                 await dispatch(increaseUserStep({ patientId: record.userRef, step }));

    //                 console.log(
    //                     `${step} stage switch ${checked ? "enabled" : "disabled"} for record:`,
    //                     record
    //                 );

    //                 fetchPatientList();
    //             } catch (error) {
    //                 console.error("Error while updating step:", error);
    //             }
    //         }
    //     },
    //     [dispatch, fetchPatientList]
    // );

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
        console.log({dataWithIds})
        return dataWithIds.filter((item) =>
            item.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.flag && item.flag.toString().toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, dataWithIds]);

    const columns = useMemo(
        () => [
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
            },
            {
                title: "Flag",
                dataIndex: "flag",
                key: "flag",
                render: (flag) =>
                    flag ? (
                        <FlagTwoTone style={{ color: "red" }} twoToneColor={"red"} />
                    ) : (
                        <FlagTwoTone fill="red" twoToneColor={"red"} style={{ color: "red" }} />
                    ),
                responsive: ["sm"]
            },

            {
                title: "Lab",
                dataIndex: "lab",
                key: "lab",
                render: (lab) =>
                    lab ? (
                        <ExperimentOutlined style={{ color: "blue" }} />
                    ) : (
                        <QuestionCircleOutlined style={{ color: "gray" }} />
                    ),
                responsive: ["sm"]

            },
            {
                title: "Group",
                dataIndex: "groups",
                key: "groups",
                render: () => <p> Individual Screen - M</p>,
                responsive: ["sm"]
            },
            {
                title: "Clinician",
                dataIndex: "clinician",
                key: "clinician",
                render: () => <p> Clinician Bama Bish</p>,
            },
            // {
            //     title: "Action",
            //     key: "action",
            //     render: (_, record) => (
            //         <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            //             <SwitchWrapper
            //                 checked={record.patientStat?.statLevel === 1 || record.patientStat?.statLevel === 2 || record.patientStat?.statLevel === 3 || record.patientStat?.statLevel === 4}
            //                 onChange={(checked, e) => handleSwitchChange(checked, record, 1, e)}
            //             />


            //         </div>
            //     ),
            // },
            // {
            //     title: "Second Step",
            //     key: "action1",
            //     render: (_, record) => (
            //         <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            //             <Switch
            //                 checked={record.patientStat?.statLevel === 4 || record.patientStat?.statLevel === 2}
            //                 onChange={(checked, e) => handleSwitchChange(checked, record, 2, e)}
            //                 // disabled={
            //                 //     record.patientStat?.statLevel !== 2
            //                 // } 
            //                 />

            //         </div>
            //     ),
            // },
            // {
            //     title: "Third Step",
            //     key: "action2",
            //     render: (_, record) => (
            //         <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            //             <Switch
            //                 checked={record.patientStat?.statLevel === 4}
            //                 onChange={(checked, e) => handleSwitchChange(checked, record, 4, e)}
            //                />
            //         </div>
            //     ),
            // },
        ],
        []
    );

    const PatientList = React.memo(
        () => (
            <Card>

                <Table
                    columns={columns}
                    dataSource={filteredData.slice(
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
                    onRow={(record) => ({
                        onClick: (e) => {
                            if (!e.target.closest(".ant-switch")) {
                                localStorage.setItem("patient", JSON.stringify(record));
                                navigate(`/doctor/user/${record.userRef}`, {
                                    state: { user: record },
                                });
                            }
                        },
                    })}
                />
            </Card>
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
                <Tabs items={items}
                    tabBarExtraContent={<div style={{ marginBottom: 16 }}>
                        <Input
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </div>} />
            </Col>
        </Row>
    );
}
