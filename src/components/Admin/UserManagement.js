import React, { useEffect, useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Input, Menu, Popover, Table, Tabs } from "antd";
import SetUserPassword from "./SetUserPassword";
import './Admin.css';
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../utils/envAccess";
import { handleApiError } from "../Handler/ExceptionHandler";
import ChangeEmail from "./ChangeEmail";

const UserManagement = () => {
  const [isOpen, setOpen] = useState('');
  const [currAccount, setAccount] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [careProviderSource, setCareProviderSource] = useState([]);
  const [careProviderTable, setCareProviderTable] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState('patients');
  const [careDataLoaded, setCareDataLoaded] = useState(false);

  const [searchParams, setSearchParams] = useState({
    account: '',
    firstName: '',
    lastName: ''
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

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

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

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
      dataIndex: 'menu',
      key: 'menu',
    }
  ];

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
        };
      });
      setDataSource(formatted);
      setPagination((prev) => ({ ...prev, total: formatted.length }));
    });
  }, [userAuth]);

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
  }, [searchParams, dataSource, careProviderSource]);

  const items = [
    {
      label: 'Patients',
      key: 'patients',
      children: (
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={pagination}
          onChange={handleTableChange}
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
        />
      )
    },
    {
      label: 'Requests',
      key: 'Requests',
      children: (
        <Table
          dataSource={careProviderTable}
          columns={columns}
          pagination={carePagination}
          onChange={handleCareTableChange}
        />
      )
    }
  ];

  return (
    <div style={{ margin: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 className="h3-admin-title">Users</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
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

export default UserManagement;
