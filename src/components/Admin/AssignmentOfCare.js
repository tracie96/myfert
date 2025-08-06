import React, { useEffect, useState } from "react";
import { CaretUpOutlined } from "@ant-design/icons";
import { CaretDownOutlined } from "@ant-design/icons";
import { MoreOutlined } from "@ant-design/icons";
import { Input, Menu, Popover, Table, Tabs } from "antd";
import SetUserPassword from "./SetUserPassword";
import './Admin.css';
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../utils/envAccess";
import { handleApiError } from "../Handler/ExceptionHandler";
import ChangeEmail from "./ChangeEmail";
import { message, Modal, Spin } from "antd";


const AssignmentOfCare = () => {
    // const [isOpentog, setIsOpenToggle] = useState(false);
    const [isOpen, setOpen] = useState('');
    const [currAccount, setAccount] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [careProviderSource, setCareProviderSource] = useState([]);
    const [careProviderTable, setCareProviderTable] = useState([]);
    const [activeTabKey, setActiveTabKey] = useState('patients');
    const [careDataLoaded, setCareDataLoaded] = useState(false);
    const [requestsData, setRequestsData] = useState([]);
    const [requestsTable, setRequestsTable] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [providerExpandedData, setProviderExpandedData] = useState({});
    const [loadingKeys, setLoadingKeys] = useState([]); // tracks which keys are loading


    const [requestsPagination, setRequestsPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    //   const toggleTable = () => {
    //     setIsOpenToggle(prev => !prev);
    //   };


    const [searchParams, setSearchParams] = useState({
        account: '',
        firstName: '',
        lastName: ''
    });

    //   const [pagination, setPagination] = useState({
    //     current: 1,
    //     pageSize: 10,
    //     total: 0
    //   });

    const [carePagination, setCarePagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const userAuth = useSelector((state) => state?.authentication?.userAuth);

    const MenuPopover = ({ account }) => (
        <Popover
            placement="rightTop"
            content={<ContentMenu account={account} />}
            trigger='click'
        >
            <MoreOutlined />
        </Popover>
    );

    const ContentMenu = ({ account }) => (
        <Menu
            mode="inline"
            items={[
                {
                    key: 'application',
                    label: "View Application",
                    onClick: () => { setAccount(account); setOpen('Application'); }
                },
                {
                    key: 'password',
                    label: "Reset Password",
                    onClick: () => { setAccount(account); setOpen('Password'); }
                },
                {
                    key: 'switch',
                    label: "Change Email",
                    onClick: () => { setAccount(account); setOpen('Email'); }
                }
            ]}
        />
    );

    //   const handleTableChange = (pagination, filters, sorter) => {
    //     setPagination(pagination);
    //   };

    const handleCareTableChange = (pagination, filters, sorter) => {
        setCarePagination(pagination);
    };

    const columns = [
        {
            title: 'Account #',
            dataIndex: 'account',
            key: 'account',
            sorter: (a, b) => a.account.localeCompare(b.account),
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: 'Patient', value: 'Patient' },
                { text: 'Doctor', value: 'Doctor' },
                { text: 'Nurse', value: 'Nurse' }
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Activated',
            dataIndex: 'activated',
            key: 'activated',
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Waiting for Approval', value: 'Waiting for Approval' }
            ],
            onFilter: (value, record) => record.activated === value,
        },
        {
            title: 'Accepting Patients?',
            dataIndex: 'acceptingPatients',
            key: 'acceptingPatients',
            filters: [
                { text: 'Yes', value: 'Yes' },
                { text: 'No', value: 'No' }
            ],
            onFilter: (value, record) => record.acceptingPatients === value,
        },
        {
            title: '',
            key: 'expand',
            render: (text, record) => (
                <span onClick={() => handleProviderExpand(record)}>
                    {expandedRowKeys.includes(record.key) ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </span>
            )
        }



    ];

    const requestColumns = [
        {
            title: 'Account #',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Requested By',
            dataIndex: 'requestedBy',
            key: 'requestedBy',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Requested Date',
            dataIndex: 'requestedDate',
            key: 'requestedDate',
        },
        {
            title: '',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '4px 12px',
                            fontWeight: 'bold'
                        }}
                        onClick={() => handleReject(record)}
                    >
                        Reject
                    </button>
                    <button
                        style={{
                            backgroundColor: 'green',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '4px 12px',
                            fontWeight: 'bold'
                        }}
                        onClick={() => handleAccept(record)}
                    >
                        Accept
                    </button>
                </div>
            )
        }
    ];

    const providerExpandedColumns = [
        { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName' },
        { title: 'Account #', dataIndex: 'account', key: 'account' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
    ];

    const handleProviderExpand = async (record) => {
        const key = record.key;
    
        // Collapse if already expanded
        if (expandedRowKeys.includes(key)) {
            setExpandedRowKeys(prev => prev.filter(k => k !== key));
            return;
        }
    
        // If data is already cached, just expand
        if (providerExpandedData[key]) {
            setExpandedRowKeys(prev => [...prev, key]);
            return;
        }
    
        // Show loading spinner
        setLoadingKeys(prev => [...prev, key]);
    
        try {
            const children = await getProviderPatients(key);
    
            // Cache was updated in getProviderPatients
            setExpandedRowKeys(prev => [...prev, key]);
    
            // Show message only if no data returned
            if (!children || children.length === 0) {
               // message.info("No patients assigned to this provider.");
            }
    
        } catch (err) {
            console.error("Error fetching patients", err);
        } finally {
            setLoadingKeys(prev => prev.filter(k => k !== key));
        }
    };

    const getProviderPatients = async (doctorRef) => {
        if (providerExpandedData[doctorRef]) {
            return providerExpandedData[doctorRef]; // return cached
        }
        const config = {
            headers: { Authorization: `Bearer ${userAuth?.obj?.token}` },
        };

        try {
            const response = await axios.get(`${baseUrl}Admin/GetPatientByDoctor/${doctorRef}/0/50`, config);
            const result = response.data;

            const formatted = result?.map((patient, index) => ({
                key: `${doctorRef}-patient-${index}`,
                patientName: `${patient.firstname || ''} ${patient.lastname || ''}`,
                account: patient.userRef || '',
                status: patient.patientStat || 'Active',
            })) || [];

            setProviderExpandedData(prev => ({ ...prev, [doctorRef]: formatted }));

            return formatted;
        } catch (error) {
            handleApiError(error);
            return [];
        }
    };

    const handleRequestsTableChange = (pagination, filters, sorter) => {
        setRequestsPagination(pagination);
    };
    const getExpandedData = (record) => {
        return record.providers?.map((provider, index) => ({
            key: `${record.key}-provider-${index}`,
            providerName: provider.providerName || '',
            providerRole: provider.providerRole || 'N/A',
            statusRemark: provider.statusRemark || '',
        })) || [];
    };


    // Fetch Patients
    useEffect(() => {
        const fetchPatients = async () => {
            const config = {
                headers: { Authorization: `Bearer ${userAuth?.obj?.token}` },
            };
            try {
                const response = await axios(`${baseUrl}Admin/GetPatientList/0/100`, config);
                return response.data;
            } catch (error) {
                handleApiError(error);
                return [];
            }
        };



        fetchPatients().then((res) => {
            if (!Array.isArray(res)) return;
            const formatted = res.map((user) => {
                const account = user.userRef || '';
                return {
                    key: account,
                    account: account,
                    firstName: user.firstname || '',
                    lastName: user.lastname || '',
                    role: 'Patient',
                    activated: user.patientStat || 'Active',
                    acceptingPatients: 'Yes',
                    menu: <MenuPopover account={account} />,
                    providers: user.providers || [],

                };
            });

            setDataSource(formatted);
            // setPagination((prev) => ({ ...prev, total: formatted.length }));
        });
    }, [userAuth]);

    //fetch Request data
    useEffect(() => {
        const fetchPendingRequests = async () => {
            const config = {
                headers: { Authorization: `Bearer ${userAuth?.obj?.token}` },
            };
            try {
                const response = await axios.get(`${baseUrl}Admin/GetPendingCaregiverRequests`, config);
                const res = response.data;

                if (!Array.isArray(res)) return;

                const formatted = res.map((item) => {
                    const account = item.id?.toString();
                    return {
                        key: account,
                        account: account,
                        firstName: item.patientfirstname || '',
                        lastName: item.patientlastname || '',
                        requestedBy: item.caregiver || '',
                        role: item.role || '',
                        requestedDate: new Date(item.createdOn).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        }),
                    };
                });

                setRequestsData(formatted);
                setRequestsPagination((prev) => ({ ...prev, total: formatted.length }));
            } catch (error) {
                handleApiError(error);
            }
        };

        if (activeTabKey === 'Requests') {
            fetchPendingRequests();
        }
    }, [activeTabKey, userAuth]);

    const handleAccept = (record) => {
        Modal.confirm({
            title: (
                <span>
                    Do you wish to <span style={{ color: 'green', fontWeight: 'bold' }}>accept</span> this assignment?
                </span>
            ),
            icon: null,
            okText: 'Yes',
            cancelText: 'Close',
            okButtonProps: {
                style: {
                    backgroundColor: 'green',
                    borderColor: 'green',
                },
            },
            onOk: async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${userAuth?.obj?.token}` },
                    };
                    const payload = {
                        yesNo: true,
                        id: parseInt(record.account),
                    };
                    await axios.post(`${baseUrl}Admin/AcceptRejectCaregiverPatientLink`, payload, config);
                    setRequestsTable(prev => prev.filter(item => item.account !== record.account));
                    message.success("Request accepted successfully");
                } catch (error) {
                    handleApiError(error);
                }
            },
        });
    };
    

    const handleReject = (record) => {
        Modal.confirm({
            title: (
                <span>
                    Do you wish to <span style={{ color: 'red', fontWeight: 'bold' }}>reject</span> this assignment?
                </span>
            ),
            icon: null,
            okText: 'Yes',
            cancelText: 'Close',
            okButtonProps: {
                style: {
                    backgroundColor: 'red',
                    borderColor: 'red',
                },
            },
            onOk: async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${userAuth?.obj?.token}` },
                    };
                    const payload = {
                        yesNo: false,
                        id: parseInt(record.account),
                    };
                    await axios.post(`${baseUrl}Admin/AcceptRejectCaregiverPatientLink`, payload, config);
                    setRequestsTable(prev => prev.filter(item => item.account !== record.account));
                    message.success("Request rejected successfully");
                } catch (error) {
                    handleApiError(error);
                }
            },
        });
    };

    const handleExpand = (key) => {
        setExpandedRowKeys((prevKeys) =>
            prevKeys.includes(key)
                ? prevKeys.filter(k => k !== key)
                : [...prevKeys, key]
        );
    };
    // Fetch Care Providers
    useEffect(() => {
        const fetchCareProviders = async () => {
            const config = {
                headers: { Authorization: `Bearer ${userAuth?.obj?.token}` },
            };
            try {
                const response = await axios(`${baseUrl}Admin/GetCareGiverList/0/100`, config);
                const res = response.data;

                if (!Array.isArray(res)) return;

                const formatted = res.map((user) => {
                    const account = user.userRef || '';
                    return {
                        key: account,
                        account: account,
                        firstName: user.firstname || '',
                        lastName: user.lastname || '',
                        role: 'Care Provider',
                        activated: user.patientStat || 'Active',
                        acceptingPatients: 'Yes',
                        menu: <MenuPopover account={account} />,
                    };
                });

                setCareProviderSource(formatted);
                setCarePagination((prev) => ({ ...prev, total: formatted.length }));
                setCareDataLoaded(true);
            } catch (error) {
                handleApiError(error);
            }
        };

        // Only load data when Care Provider tab is clicked
        if (activeTabKey === 'providers' && !careDataLoaded) {
            fetchCareProviders();
        }
    }, [activeTabKey, userAuth, careDataLoaded]);


    // Search Filtering
    useEffect(() => {
        const filterRecords = (records) =>
            records.filter(record => {
                const accountMatch = searchParams.account
                    ? record.account?.toLowerCase().includes(searchParams.account.toLowerCase())
                    : true;
                const firstNameMatch = searchParams.firstName
                    ? record.firstName?.toLowerCase().includes(searchParams.firstName.toLowerCase())
                    : true;
                const lastNameMatch = searchParams.lastName
                    ? record.lastName?.toLowerCase().includes(searchParams.lastName.toLowerCase())
                    : true;
                return accountMatch && firstNameMatch && lastNameMatch;
            });

        setTableData(filterRecords(dataSource));
        setCareProviderTable(filterRecords(careProviderSource));
        setRequestsTable(filterRecords(requestsData));

    }, [searchParams, dataSource, careProviderSource, requestsData]);

    const expandedColumns = [
        { title: 'Provider Name', dataIndex: 'providerName', key: 'providerName' },
        { title: 'Provider Role', dataIndex: 'providerRole', key: 'providerRole' },
        { title: 'Status', dataIndex: 'statusRemark', key: 'statusRemark' },
    ];


    const items = [
        {
            label: 'Patients',
            key: 'patients',
            children: (
                <Table
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Table
                                columns={expandedColumns}
                                dataSource={getExpandedData(record)} // <-- get mock or real child data here
                                pagination={false}
                                rowKey="key"
                            />
                        ),
                        rowExpandable: () => true,

                        expandedRowKeys: expandedRowKeys,
                        onExpand: (expanded, record) => handleExpand(record.key),
                        expandIconColumnIndex: -1 // Prevent default arrow column
                    }}
                />

            )
        },
        {
            label: 'Care Providers',
            key: 'providers',
            children: (
                <Table
                    dataSource={careProviderTable}
                    columns={columns}
                    pagination={carePagination}
                    onChange={handleCareTableChange}
                    expandable={{
                        expandedRowRender: (record) => {
                            const data = providerExpandedData[record.account];
                            if (loadingKeys.includes(record.key)) {
                                return (
                                    <div style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Spin tip="Loading patients..." />
                                    </div>
                                );
                                
                            }
                    
                            return (
                                <Table
                                    columns={providerExpandedColumns}
                                    dataSource={data || []}
                                    pagination={false}
                                    rowKey="key"
                                />
                            );
                        },
                        rowExpandable: () => true,
                        expandedRowKeys: expandedRowKeys,
                        expandIconColumnIndex: -1,
                    }}
                    

                />
            )
        },

        {
            label: 'Requests',
            key: 'Requests',
            children: (
                <Table
                    dataSource={requestsTable}
                    columns={requestColumns}
                    pagination={requestsPagination}
                    onChange={handleRequestsTableChange}
                />
            )
        }
    ];


    return (
        <div style={{ margin: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 className="h3-admin-title">Users</h3>
                <div id="searchWrapper" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <Input
                        placeholder="Search by Account #"
                        value={searchParams.account}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, account: e.target.value }))}
                    />
                    <Input
                        placeholder="Search by First Name"
                        value={searchParams.firstName}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                    <Input
                        placeholder="Search by Last Name"
                        value={searchParams.lastName}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                </div>
            </div>

            <Tabs
                items={items}
                activeKey={activeTabKey}
                onChange={(key) => setActiveTabKey(key)}
            />


            <SetUserPassword isOpen={isOpen} setOpen={setOpen} account={currAccount} />
            <ChangeEmail isOpen={isOpen} setOpen={setOpen} account={currAccount} />
        </div>
    );
}

export default AssignmentOfCare;
