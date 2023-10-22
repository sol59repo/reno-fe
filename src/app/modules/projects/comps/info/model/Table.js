import React, { useState } from 'react'
import MUIDataTable from "mui-datatables"
import { MatxMenu } from 'app/components'
import { Icon, IconButton, Grid, TextField } from '@mui/material'

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom'
import Helpers from 'app/utils/Helpers'
import { Small as Sm, StyledItem } from 'app/commons/StyledEl'

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

const Table = (props) => {
    const {
        gotoSpace,
        spaces,
        _handleStatus
    } = props

    const _helpers = Helpers();

    const columns = [
        {
            name: "spaceId",
            label: "Space ID",
            options: {
                filter: true, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        {value}
                    </>
                }
            }
        },
        {
            name: "location",
            label: "LOCATION",
            options: {
                filter: true, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return value === "unasigned" ?
                        <Sm bgcolor={_helpers.statusColor(value)}>
                            {value}
                        </Sm>
                        : value
                }
            }
        },
        {
            name: "status",
            label: "STATUS",
            options: {
                filter: true, sort: false,
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
            name: "spaceId",
            label: "Action",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta;
                    const { status } = spaces[rowIndex]
                    return (
                        <>
                            <MatxMenu
                                menuButton={
                                    <IconButton>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                }
                            >
                                <>
                                    <StyledItem onClick={() => _handleStatus(value, "Pending")}>
                                        <Icon className="icon">remove_circle_outline</Icon>{' '}
                                        Pending
                                    </StyledItem>
                                    {status !== "Archived" &&
                                        <>
                                            <StyledItem onClick={() => _handleStatus(value, "Finished")}>
                                                <Icon className="icon">check</Icon>{' '}
                                                Finished
                                            </StyledItem>
                                            <StyledItem onClick={() => _handleStatus(value, "Inprogress")}>
                                                <Icon className="icon">timer</Icon>{' '}
                                                Inprogress
                                            </StyledItem>
                                            <StyledItem onClick={() => _handleStatus(value, "Archived")}>
                                                <Icon className="icon">archive</Icon>{' '}
                                                Archived
                                            </StyledItem>
                                        </>
                                    }
                                </>
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
        rowsPerPage: 100,
        sortOrder: {
            name: 'id',
            direction: 'desc'
        },
        onTableChange: (action, state) => {

        },
        onCellClick: (colData, cellMeta) => {
            const { rowIndex, colIndex } = cellMeta;
            if (colIndex === 3) {
                return;
            }
            const { spaceId } = spaces[rowIndex]
            gotoSpace(spaceId)
        },
    }

    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
                <MUIDataTable
                    title={"List of Projects"}
                    data={spaces}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>
        </CacheProvider>
    );
};

export default Table;