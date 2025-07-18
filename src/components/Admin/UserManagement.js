import React, { useEffect, useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Input, Menu, Popover, Table, Tabs } from "antd";
import SetUserPassword from "./SetUserPassword";
import './Admin.css'
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

  const userAuth = useSelector(
    (state) => state?.authentication?.userAuth
  );

  useEffect(() => {
    const list = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.obj?.token}`,
        },
      }
      try {
        const response = await axios(`${baseUrl}Admin/GetPatientList/0/100`, config);
        return response.data
      } catch(error) {
        handleApiError(error);
        return [];
      }
    }
    
    list().then((res) => {
      const formattedData = res.map(user => ({
        key: user.userId || '',
        account: user.userId || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'Patient',
        activated: user.status || 'Active',
        acceptingPatients: user.acceptingPatients || 'Yes',
        menu: <MenuPopover account={user.userId || ''} />
      }));
      
      setDataSource(formattedData);
      setPagination(prev => ({...prev, total: formattedData.length}));
    });
    
  }, [userAuth]);

  useEffect(() => {
    const filtered = dataSource.filter(record => {
      if (!record) return false;
      
      const accountMatch = record.account ? 
        record.account.toString().includes(searchParams.account) : 
        false;
      
      const firstNameMatch = record.firstName ? 
        record.firstName.toLowerCase().includes(searchParams.firstName.toLowerCase()) : 
        false;
      
      const lastNameMatch = record.lastName ? 
        record.lastName.toLowerCase().includes(searchParams.lastName.toLowerCase()) : 
        false;
      
      return accountMatch && firstNameMatch && lastNameMatch;
    });
    
    setTableData(filtered);
  }, [searchParams, dataSource]);

  const ContentMenu = ({ account }) => {
    return <Menu
      mode="inline"
      items={[
        {key: 'password', label: "Reset Password", onClick: () => {setAccount(account); setOpen('Password'); }},
        {key: 'switch', label: "Change Email", onClick: () => {setAccount(account); setOpen('Email'); }},
      ]}
    />
  }

  function MenuPopover({ account }) {
    return <Popover placement="rightTop" content={<ContentMenu account={account}/>} trigger='click'><MoreOutlined/></Popover>
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: 'Account #',
      dataIndex: 'account',
      key: 'account',
      sorter: (a, b) => parseInt(a.account) - parseInt(b.account),
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
    },
  ];

  const items = [
    {
      label: 'Patients',
      key: 'patients',
      children: <Table 
        dataSource={tableData} 
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />
    },
    {
      label: 'Care Providers',
      key: 'providers',
      children: <Table 
        dataSource={tableData} 
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />
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
            onChange={(e) => setSearchParams(prev => ({...prev, account: e.target.value}))}
          />
          <Input
            placeholder="Search by First Name"
            value={searchParams.firstName}
            onChange={(e) => setSearchParams(prev => ({...prev, firstName: e.target.value}))}
          />
          <Input
            placeholder="Search by Last Name"
            value={searchParams.lastName}
            onChange={(e) => setSearchParams(prev => ({...prev, lastName: e.target.value}))}
          />
        </div>
      </div>
      
      <Tabs items={items} />
      
      <SetUserPassword 
        isOpen={isOpen} 
        setOpen={setOpen}
        account={currAccount}
      />
      <ChangeEmail
        isOpen={isOpen}
        setOpen={setOpen}
        account={currAccount}
      />
    </div>
  );
}

export default UserManagement;