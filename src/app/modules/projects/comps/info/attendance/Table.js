import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { Icon, Fab } from "@mui/material";
import Helpers from "app/utils/Helpers";
import { Small as Sm } from "app/commons/StyledEl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { styled, useTheme } from "@mui/system";
import { Span } from "app/components/Typography";
import { getTimeLogsDifference, getTimeLogsTotalSpent } from "utils";
import format from "date-fns/format";
import CustomToolbarSelect from "./CustomToolbarSelect";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

const StyledSpan = styled(Span)(({ bgColor }) => ({
  color: "#fff",
  padding: "3px 10px",
  borderRadius: "2px",
  background: bgColor,
}));

const AttendanceTable = ({
  data,
  handleOpen,
  submitBulkActions,
  submitBulkActionsLeaveOrAbsent,
}) => {
  const _helpers = Helpers();
  const { palette } = useTheme();
  const textMuted = palette.text.secondary;
  const bgPrimary = palette.primary.main;
  const bgError = palette.error.main;

  const _displayTime = (dateTime) => {
    const time = dateTime.split("AT");
    return time[1];
  };

  const columns = [
    {
      name: "empName",
      label: "Employee",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <>{value}</>;
        },
      },
    },
    {
      name: "date",
      label: "Date",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <>{format(new Date(value), "MMMM dd, yyyy")}</>;
        },
      },
    },
    {
      name: "availabilityStatus",
      label: "Availability Status",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              {value === null ? (
                <div> --- </div>
              ) : (
                <Sm bgcolor={_helpers.statusColor(value)}>{value}</Sm>
              )}
            </>
          );
        },
      },
    },
    {
      name: "timeIn",
      label: "Time In",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              {value === null ? (
                <div> ---</div>
              ) : (
                <StyledSpan bgcolor={bgPrimary}>
                  {_displayTime(value)}
                </StyledSpan>
              )}
            </>
          );
        },
      },
    },
    {
      name: "timeOut",
      label: "Time Out",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              {value === null ? (
                <div> ---</div>
              ) : (
                <StyledSpan bgcolor={bgError}>{_displayTime(value)}</StyledSpan>
              )}
            </>
          );
        },
      },
    },
    {
      name: "hourSpent",
      label: "Hour Spent",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              {value === "0" ? (
                "---"
              ) : (
                <StyledSpan bgcolor={textMuted}>
                  {getTimeLogsTotalSpent(value)}
                </StyledSpan>
              )}
            </>
          );
        },
      },
    },
    {
      name: "count",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Fab
              size="small"
              className="button"
              onClick={() => handleOpen(value)}
            >
              <Icon fontSize="sm">arrow_forward</Icon>
            </Fab>
          );
        },
      },
    },
  ];

  const options = {
    search: true,
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    filterType: "dropdown",
    responsive: "standard", // standard , simple,vertical,stacked
    tableBodyHeight: "100%",
    selectableRows: "multiple",
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <CustomToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        data={data}
        submitBulkActions={submitBulkActions}
        submitBulkActionsLeaveOrAbsent={submitBulkActionsLeaveOrAbsent}
      />
    ),
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      //   console.log(rowsSelectedData, allRows, rowsSelected);
    },
    rowsPerPage: 100,
    sortOrder: {
      name: "id",
      direction: "desc",
    },
    setTableProps: () => ({
      padding: "none",
      size: "small",
    }),
  };

  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={createTheme()}>
        <MUIDataTable
          title={"Attendance Recording"}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default AttendanceTable;
