import React, { useState } from 'react'
import MUIDataTable from "mui-datatables"
import { MatxMenu } from 'app/components'
import { Icon, IconButton } from '@mui/material'
import Helpers from "../../../utils/Helpers"
import { Small as Sm, StyledItem } from "../../../commons/StyledEl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import CustomToolbarSelect from './CustomToolbarSelect'
import Logic from '../logic/Logic'

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

const TableStaff = (props) => {
    const {
        _handleDelete,
        _handleStatus,
        _viewStaff,
        staffs,
    } = props

    const _helpers = Helpers();

    console.log(staffs);

    const columns = [
        {
            name: "ID",
            label: "ID",
        },
        {
            name: "firstname",
            label: "FIRSTNAME",
            options: { filter: true, sort: true, }
        },
        {
            name: "lastname",
            label: "LASTNAME",
            options: { filter: true, sort: true, }
        },
        {
            name: "usertype",
            label: "EMPLOYEE TYPE",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Sm bgcolor={_helpers.statusColor(value)}>
                            {value}
                        </Sm>
                    )
                }
            }
        },
        {
            name: "status",
            label: "Status",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Sm bgcolor={_helpers.statusColor(value)}>
                            {value}
                        </Sm>
                    )
                }
            }
        },
        {
            name: "count",
            label: "Action",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta;
                    const { usertype } = staffs[rowIndex];
                    return (
                        <>
                            <MatxMenu
                                menuButton={
                                    <IconButton>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                }
                            >
                                <StyledItem onClick={() => _viewStaff(staffs[rowIndex].ID)}>
                                    <Icon className="icon">info</Icon> View Info
                                </StyledItem>
                                {usertype !== "Superadmin" && (
                                    <>
                                        <StyledItem onClick={_handleStatus(value, 'Active')}>
                                            <Icon className="icon">check_box</Icon> Active
                                        </StyledItem>
                                        <StyledItem onClick={_handleStatus(value, 'Inactive')}>
                                            <Icon className="icon">remove_circle_outline</Icon> Inactive
                                        </StyledItem>

                                        <StyledItem onClick={_handleStatus(value, 'Archived')}>
                                            <Icon className="icon">archive</Icon>{' '}
                                            Archive
                                        </StyledItem>
                                        <StyledItem onClick={_handleDelete(value)}>
                                            <Icon className="icon">delete</Icon> Delete
                                        </StyledItem>
                                    </>
                                )}

                            </MatxMenu>

                        </>

                    )
                }
            }
        }
    ];


    const options = {
        search: true,
        download: false,
        print: false,
        viewColumns: false,
        filter: true,
        filterType: "dropdown",
        responsive: "vertical", // standard , simple,vertical,stacked
        tableBodyHeight: "100%",
        selectableRows: "none",
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} />
        ),
        rowsPerPage: 15,
        sortOrder: {
            name: 'id',
            direction: 'desc'
        },
        onTableChange: (action, state) => {

        },
        setTableProps: () => ({
            padding: "checkbox",
            size: "small"
        })
    }

    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
                <MUIDataTable
                    title={"List of Employee"}
                    data={staffs}
                    columns={columns}
                    options={options}
                />

            </ThemeProvider>
        </CacheProvider>
    );
};

export default TableStaff;