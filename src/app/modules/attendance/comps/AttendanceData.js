import React, { useState, useEffect } from 'react'
import MUIDataTable from "mui-datatables"
import { MatxMenu } from 'app/components'
import { TextField, Grid, Chip, Fab, Icon, Button, Avatar } from '@mui/material'
import Helpers from "../../../utils/Helpers"
import { Small as Sm, StyledButton, StyledItem } from "../../../commons/StyledEl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { format } from 'date-fns'
import { useTheme, Box, styled } from '@mui/system'
import { H5, Small } from 'app/components/Typography'

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { getTimeLogsTotalSpent } from 'utils';

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))



const AttendanceData = (props) => {
    const { viewInfo, data, setFrom, setTo, from, to, getEmployeesAttendance } = props

    const _helpers = Helpers();
    const { palette } = useTheme()
    const bgPrimary = palette.primary.main
    const bgSecondary = palette.secondary.main
    const bgSuccess = palette.success.light
    const textMuted = palette.text.secondary

    const [state, setState] = useState({
        status: 'Project 1',
        startDate: new Date(),
        endDate: new Date()
    });

    const {
        status,
        startDate,
        endDate,
    } = state

    const handleDateChange = (type, date) => {
        setState({
            ...state,
            [type]: date,
        })


        if (type === "startDate") {
            setFrom(date)
            getEmployeesAttendance(date, to);
        } else {
            setTo(date)
            getEmployeesAttendance(from, date);
        }

    }



    const columns = [
        {
            name: "employee",
            label: "Employee",
            options: {
                filter: true, sort: true,
                customBodyRenderLite: (dataIndex) => {
                    let user = data[dataIndex]
                    return (
                        <FlexBox>
                            <Avatar
                                sx={{ width: 48, height: 48 }}
                                src={user?.imgUrl}
                            />
                            <Box ml="12px">
                                <H5 sx={{ fontSize: '15px' }}>{user?.empName}</H5>
                                <Small sx={{ color: textMuted }}>
                                    {user?.ID}
                                </Small>
                            </Box>
                        </FlexBox>
                    )
                }
            }
        },
        {
            name: "location", label: "Project", options: {
                filter: true, sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return value
                }
            }
        },
        {
            name: "absences",
            label: "No. of Absence",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Sm bgcolor={bgSecondary} >
                            {value}
                        </Sm>
                    )
                }
            }
        },
        {
            name: "hourSpent",
            label: "Hours Spent",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        {value === "0" ? "---" :
                            <Sm bgcolor={bgPrimary}>
                                {getTimeLogsTotalSpent(value)}
                            </Sm>
                        }
                    </>
                }
            }
        },
        {
            name: "fkUser",
            label: "Action",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta;
                    const rowData = data[rowIndex];
                    return (
                        <Fab size='small' className="button"
                            onClick={() => viewInfo(value, rowData)}>
                            <Icon>arrow_forward</Icon>
                        </Fab>
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
        responsive: "standard", // standard , simple,vertical,stacked
        tableBodyHeight: "100%",
        selectableRows: "none",
        rowsPerPage: 100,
        sortOrder: {
            name: 'id',
            direction: 'desc'
        },
        setTableProps: () => ({
            size: "small"
        }),
        customToolbar: () => {
            return (
                <>
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
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
                <MUIDataTable
                    title={"Employee Time Sheet"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>
        </CacheProvider>
    );
};



export default AttendanceData;
