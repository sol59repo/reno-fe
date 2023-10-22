import React, { useState, useEffect } from 'react'
import { Box, useTheme } from '@mui/system'
import {
    Icon,
    IconButton,
    Grid,
    TextField,
    Fab
} from '@mui/material'
import MUIDataTable from "mui-datatables"
import { MatxMenu } from 'app/components'
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import Helpers from '../../../utils/Helpers'
import { Small as Sm, StyledItem } from 'app/commons/StyledEl'

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});



const TableTicket = (props) => {
    const theme = useTheme();

    const {
        tickets,
        setOpenAddNew
    } = props


    const [state, setState] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const {
        startDate,
        endDate,
    } = state

    const handleDateChange = (type, date) => {
        setState({
            ...state,
            [type]: date,
        })
    }

    const _helpers = Helpers();

    const columns = [
        {
            name: "count",
            label: "Ticket ID",
            options: {
                filter: true, sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        {value}
                    </>
                }
            }
        },
        {
            name: "name",
            label: "Name",
            options: {
                filter: true, sort: true,
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
            name: "description",
            label: "Description",
            options: {
                filter: true, sort: true,
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
            name: "ticketId",
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
                                <StyledItem >
                                    <Icon className="icon">info</Icon> View Info
                                </StyledItem>
                                <StyledItem >
                                    <Icon className="icon">check</Icon>{' '}
                                    Finished
                                </StyledItem>
                                <StyledItem >
                                    <Icon className="icon">timer</Icon>{' '}
                                    Inprogress
                                </StyledItem>
                                <StyledItem >
                                    <Icon className="icon">remove_circle_outline</Icon>{' '}
                                    Pending
                                </StyledItem>
                                <StyledItem >
                                    <Icon className="icon">archive</Icon>{' '}
                                    Archived
                                </StyledItem>
                                <StyledItem o>
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
        selectableRows: "none",
        rowsPerPage: 100,
        onTableChange: (action, state) => {

        },
        setTableProps: () => ({
            padding: "checkbox",
            size: "small"
        }),
        customToolbar: () => {
            return (
                <>
                    <Fab
                        size="small"
                        variant="extended"
                        className="button"
                        color='info'
                        sx={{
                            margin: 1,
                            padding: 2
                        }}
                        onClick={() => setOpenAddNew(true)}
                    >
                        <Icon sx={{ mr: 0.5 }}>add</Icon>
                        New Ticket
                    </Fab>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container >
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <DatePicker
                                    value={new Date(startDate)}
                                    onChange={(date) => handleDateChange(
                                        'startDate',
                                        date
                                    )
                                    }
                                    renderInput={(props) => (
                                        <TextField
                                            {...props}
                                            variant="standard"
                                            id="mui-pickers-date"
                                            label="Start*"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <DatePicker
                                    value={new Date(endDate)}
                                    onChange={(date) => handleDateChange(
                                        'endDate',
                                        date
                                    )
                                    }
                                    renderInput={(props) => (
                                        <TextField
                                            {...props}
                                            variant="standard"
                                            id="mui-pickers-date"
                                            label="End*"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>

                </>
            );
        }
    }

    return (
        <Box p={3}>
            <CacheProvider value={muiCache}>
                <ThemeProvider theme={createTheme()}>
                    <MUIDataTable
                        title={"List of Tickets"}
                        data={tickets}
                        columns={columns}
                        options={options}
                    />

                </ThemeProvider>
            </CacheProvider>
        </Box>
    );
};


export default TableTicket;