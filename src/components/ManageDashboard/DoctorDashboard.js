import {  Card, CardBody, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { patientList } from "../redux/doctorSlice";
import { useEffect, useMemo, useState } from "react";
import {  useNavigate } from "react-router-dom";
import DataTableComponent from "../global_component/DataTableComponent";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loggedInUser = useSelector((state) => state?.authentication?.userAuth);

  //#region Datatables
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchParam, setSearchParam] = useState("");

  const buttons = [
    {
      id: 1,
      title: "Delete",
      className: "btn btn-sm btn-danger me-1",
      icon: "bi bi-trash",
      label: "",
    },
    {
      id: 2,
      title: "Update",
      className: "btn btn-sm btn-success me-1",
      icon: "bi bi-pencil-square",
      label: "",
    },
  ];

  const columns = useMemo(
    () => [
      {
        name: "First Name",
        selector: "firstName",
        sortable: true,
        sortFunction: () => [],
      },
      {
        name: "Last Name",
        selector: "lastName",
        sortable: true,
        sortFunction: () => [],
      },
      {
        name: "Flag",
        selector: "flag",
        sortable: false,
      },
      {
        name: "Lab",
        selector: "lab",
        sortable: false,
      },
      {
        name: "Groups",
        selector: "groups",
        sortable: false,
      },
      {
        name: "# Weeks TTC",
        selector: "weeksTTC",
        sortable: false,
      },
      {
        name: "# Weeks Pregnant (Trimester)",
        selector: "weeksPregnant",
        sortable: false,
      },
      {
        name: "Appointments",
        selector: "appointmentStartDate",
        sortable: true,
        cell: (row) => (
          <span style={{ width: "200px" }}>{row.appointments}</span>
        ),
      },
      // {
      //   name: "Actions",
      //   sortable: false,
      //   cell: (row) => <CustomButtons buttons={buttons} row={row} />,
      // },
    ],
    []
  );

  const fetchPatientList = async (
    page = 1,
    size = 10,
    sortColumn = "",
    sortDirection = "",
    searchParam = ""
  ) => {
    setLoading(true);
    const params = {
      page: page,
      size: size,
      sortColumn: sortColumn,
      sortDirection: sortDirection,
      searchParam: searchParam,
    };
    try {
      const response = await dispatch(patientList(params));

      if (patientList.fulfilled.match(response)) {
        const updatedList = response?.payload?.list?.map((item) => {
          if (item && item.createdById === loggedInUser?.id) {
            item.createdBy = "You";
          }
          return item;
        });
        setData(updatedList);
        setTotalRows(response?.payload?.totalRecords);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchPatientList(
      currentPage,
      perPage,
      sortColumn,
      sortDirection,
      searchParam
    );
  }, [currentPage, perPage, sortColumn, sortDirection, searchParam,patientList]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleSort = (column, direction) => {
    if (column.selector && typeof column.selector === "string") {
      const colName =
        column.selector.charAt(0).toUpperCase() + column.selector.slice(1);
      console.log("colName: ", colName);
      setSortColumn(() => colName);
    }
    setSortDirection(direction === "asc" ? "asc" : "desc");
  };

  const handleSearch = (e) => {
    setSearchParam(e.target.value ? e.target.value : "");
  };

  //#endregion

  return (
    <>
      <Card>
        <CardBody>
          <div className="row">
            <div className="col-md-12 col-sm-12 mb-3 mt-3">
              <div className=" my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                  <h3 className="font-weight-bold">Patient List</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 mb-3">
              <div className="my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-1 small"
                    placeholder="Search..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="table-responsive">
                <DataTableComponent
                  columns={columns}
                  data={data}
                  pagination
                  paginationServer
                  progressPending={loading}
                  paginationTotalRows={totalRows}
                  paginationDefaultPage={currentPage}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  onSort={handleSort}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default DoctorDashboard;
