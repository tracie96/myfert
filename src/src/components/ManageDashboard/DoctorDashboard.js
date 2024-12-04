import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardBody } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { patientList } from "../redux/doctorSlice";
import DataTableComponent from "../global_component/DataTableComponent";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.authentication?.userAuth);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalRows: 0,
    perPage: 10,
    currentPage: 1,
  });
  const [sortConfig] = useState({
    sortColumn: "",
    sortDirection: "",
  });
  const [searchParam, setSearchParam] = useState("");

  const columns = useMemo(
    () => [
      { name: "First Name", selector: "firstname", sortable: true },
      { name: "Last Name", selector: "lastname", sortable: true },
      { name: "Flag", selector: "flag", sortable: false },
      { name: "Lab", selector: "lab", sortable: false },
      { name: "Group", selector: "groups", sortable: false },
      { name: "Clinician", selector: "weeksPregnant", sortable: false },
    ],
    [],
  );

  const fetchPatientList = useCallback(async () => {
    setLoading(true);
    const params = {
      page: pagination.currentPage,
      size: pagination.perPage,
      sortColumn: sortConfig.sortColumn,
      sortDirection: sortConfig.sortDirection,
      searchParam: searchParam,
    };
    try {
      const response = await dispatch(patientList(params));

      if (patientList.fulfilled.match(response)) {
        const updatedList = response?.payload?.data?.map((item) => {
          console.log(item);
          if (item && item.createdById === loggedInUser?.obj?.id) {
            item.createdBy = "You";
          }
          return item;
        });
        setData(updatedList);
        setPagination((prev) => ({
          ...prev,
          totalRows: response.payload.totalRecords,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [
    dispatch,
    searchParam,
    sortConfig,
    pagination,
    loggedInUserId,
    loggedInUser.obj?.id,
  ]);

  useEffect(() => {
    fetchPatientList();
  }, [fetchPatientList]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePerRowsChange = (newPerPage) => {
    setPagination((prev) => ({ ...prev, perPage: newPerPage }));
  };

  const handleSearch = (e) => {
    setSearchParam(e.target.value);
  };

  return (
    <Card>
      <CardBody>
        <div className="row">
          <div className="col-md-12 col-sm-12 mb-3 mt-3">
            <div className="my-2 my-md-0 mw-100 navbar-search">
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
                paginationTotalRows={pagination.totalRows}
                paginationDefaultPage={pagination.currentPage}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default DoctorDashboard;
