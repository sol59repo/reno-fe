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
import { useNavigate } from 'react-router-dom'


const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

const TableProjects = (props) => {
    const navigate = useNavigate();
    const {
        projectList,
        _viewInfo,
        _handleStatus,
        _handleDelete,
    } = props


    const _helpers = Helpers();

    const columns = [
        {
            name: "modelId",
            label: "Model ID",
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
            name: "name",
            label: "name",
            options: { filter: false, sort: false }
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
            name: "modelId",
            label: "Action",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>
                            <MatxMenu
                                menuButton={
                                    <IconButton>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                }
                            >
                                <StyledItem onClick={() => _handleStatus(value, "Finished")}>
                                    <Icon className="icon">check</Icon>{' '}
                                    Finished
                                </StyledItem>
                                <StyledItem onClick={() => _handleStatus(value, "Inprogress")}>
                                    <Icon className="icon">timer</Icon>{' '}
                                    Inprogress
                                </StyledItem>
                                <StyledItem onClick={() => _handleStatus(value, "Pending")}>
                                    <Icon className="icon">remove_circle_outline</Icon>{' '}
                                    Pending
                                </StyledItem>
                                <StyledItem onClick={() => _handleStatus(value, "Archived")}>
                                    <Icon className="icon">archive</Icon>{' '}
                                    Archived
                                </StyledItem>
                                <StyledItem onClick={() => _handleDelete(value)}>
                                    <Icon className="icon">delete_forever</Icon>{' '}
                                    Delete
                                </StyledItem>
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
        // tableBodyMaxHeight: '400px',
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
        }),
        onCellClick: (colData, cellMeta) => {
            const { rowIndex, colIndex } = cellMeta;
            if (colIndex === 4) {
                return;
            }
            const { modelId } = projectList[rowIndex]
            navigate(`/project-info/${modelId}`);

        },
    }

    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
                <MUIDataTable
                    title={"List of Projects"}
                    data={projectList}
                    columns={columns}
                    options={options}
                />

            </ThemeProvider>
        </CacheProvider>
    );
};

export default TableProjects;