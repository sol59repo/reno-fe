import React, { useState } from 'react'
import MUIDataTable from "mui-datatables"
import { MatxMenu } from 'app/components'
import { Icon, IconButton, Grid, TextField } from '@mui/material'
import Helpers from "../../../utils/Helpers"
import { Small as Sm, StyledButton, StyledItem } from "../../../commons/StyledEl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import CustomToolbarSelect from './CustomToolbarSelect'
import { useTheme } from '@mui/system'

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

const TableConsumables = (props) => {
    const _helpers = Helpers();
    const { palette } = useTheme()
    const bgGrey400 = palette.grey[400]
    const bgSecondary = palette.secondary.main
    const bgError = palette.error.main

    const {
        consumablesLists,
        _handleDelete,
        _handleStatus,
        viewInfo
    } = props


    const columns = [
        {
            name: "itemCode",
            label: "SKU",
            options: {
                filter: true, sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        <StyledButton
                            size={"small"}
                            style={{ fontWeight: "normal" }}
                            color="inherit"
                        >
                            {value}
                        </StyledButton>
                    </>
                }
            }
        },
        {
            name: "itemName", label: "NAME", options: {
                filter: true, sort: true,
            }
        },
        {
            name: "description", label: "DESCRIPTION", options: {
                filter: true, sort: true,
            }
        },
        {
            name: "qty",
            label: "TOTAL",
            options: {
                filter: true, sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <Sm bgcolor={bgSecondary}>
                        {value}
                    </Sm>
                }
            }
        },
        {
            name: "availableQty",
            label: "AVAILABLE",
            options: {
                filter: true, sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <Sm bgcolor={bgError}>
                        {value}
                    </Sm>
                }
            }
        },
        {
            name: "status",
            label: "STATUS",
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
            label: "ACTION",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta;


                    return (
                        <>
                            <MatxMenu
                                menuButton={
                                    <IconButton>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                }
                            >
                                <StyledItem onClick={() => viewInfo(consumablesLists[rowIndex])}>
                                    <Icon className="icon">info</Icon> Info
                                </StyledItem>
                                <StyledItem onClick={_handleStatus(tableMeta, "Archived")}>
                                    <Icon className="icon">archive</Icon>{' '}
                                    Archive
                                </StyledItem>
                                <StyledItem onClick={_handleDelete(tableMeta)}>
                                    <Icon className="icon">delete</Icon> Delete
                                </StyledItem>
                                {value === "Archived" &&
                                    <StyledItem onClick={_handleStatus(tableMeta, "In-Stock")}>
                                        <Icon className="icon">check</Icon> Restore
                                    </StyledItem>
                                }
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
            <CustomToolbarSelect
                selectedRows={selectedRows}
                displayData={displayData}
                setSelectedRows={setSelectedRows}
            />
        ),
        rowsPerPage: 100,
        sortOrder: {
            name: 'id',
            direction: 'desc'
        },
        onTableChange: (action, state) => {

        },
        setTableProps: () => ({
            size: "small"
        })
    }

    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
                <MUIDataTable
                    title={"List of Consumables"}
                    data={consumablesLists}
                    columns={columns}
                    options={options}
                />

            </ThemeProvider>
        </CacheProvider>
    );
};

export default TableConsumables;


