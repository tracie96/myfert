import React, { useEffect, useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Input, Menu, Popover, Table } from "antd";
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
  const [userSearch, setUserSearch] = useState('');

  const userAuth = useSelector(
    (state) => state?.authentication?.userAuth
  );

  useEffect( () => {
    const list = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.obj?.token}`,
        },
      }
      try {
        const response = await axios(`${baseUrl}Admin/GetPatientList`, config);
        return response.data
      } catch(error) {
        handleApiError(error);
        return [];
      }
    }
    
    list().then((res) => {
      setDataSource([ ...res.map( (user) => {
        return {
          key: user.userId,
          account: user.userId,
          type: 'Patient',
          menu: <MenuPopover account={user.userId} />
        }
      }), {
        key: 101,
        account: 101,
        type: 'Doctor',
        menu: <MenuPopover account={101} />
      }])
    });
    
  }, [userAuth] );

  useEffect( () => {
    setTableData(dataSource.filter( (record) => {
      const accountString = `${record.account}`
      return userSearch === accountString.substring(0, userSearch.length);
    }));
  }, [userSearch, dataSource] );

  const ContentMenu = ({ account }) => {
    return <Menu
      mode="inline"
      items={[
        {key: 'password', label: "Reset Password", onClick: (e) => {setAccount(account); setOpen('Password'); }},
        {key: 'switch', label: "Change Email", onClick: (e) => {setAccount(account); setOpen('Email'); }},
      ]}
    />
  }

  function MenuPopover({ account }) {
    return <Popover placement="rightTop" content={<ContentMenu account={account}/>} trigger='click'><MoreOutlined/></Popover>
  }

  const filterType = [...new Set (tableData.map( (record) => record.type))].map( (field) => {
    return {
      text: field,
      value: field,
    }
  })
  
  const columns = [
    {
      title: 'Account #',
      dataIndex: 'account',
      key: 'account',
      sorter: (a, b) => parseInt(a.account) - (parseInt(b.account)),
    },
    {
      title: 'User Type',
      dataIndex: 'type',
      key: 'type',
      filters: filterType,
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      title: '',
      dataIndex: 'menu',
      key: 'menu',
    },
  ];

  return (
  <div style={{
    margin: '0.5vw'
  }}>
    <div style={{display: 'flex', width: '50%'}}>
      <h3 className="h3-admin-title">Users</h3>
      <Input
        placeholder="Search by account #"
        style={{marginLeft: '2vw'}}
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
      />
    </div>
    <Table 
      dataSource={tableData} 
      columns={columns} 
      style={{width: '50%'}}
    />
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
  )
}

export default UserManagement;