import React from "react";
import DataTable from "react-data-table-component";

const DataTableComponent = ({ ...props }) => {
  return (
    <>
      <DataTable {...props} />
    </>
  );
};

export default DataTableComponent;
