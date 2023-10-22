import React, { useState } from 'react'
import MUIDataTable from "mui-datatables"
import { MatxMenu, SimpleCard } from 'app/components'
import {
    Icon, IconButton, Grid, TextField, Dialog, Avatar, AppBar, Toolbar, Fab,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,

} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Helpers from "../../../utils/Helpers"
import { Small as Sm, StyledButton, StyledItem } from "../../../commons/StyledEl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { Box, styled, useTheme } from '@mui/system'
import { H2, H6, H3, Small, Span } from 'app/components/Typography'
import { format } from 'date-fns'
import Slide from '@mui/material/Slide'
import { getTimeLogsDifference, getTimeLogsTotalSpent } from 'utils';
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic'


const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});


const StyledSpan = styled(Span)(({ bgColor }) => ({
    color: '#fff',
    padding: '3px 10px',
    borderRadius: '2px',
    background: bgColor,
}))

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0px 30px',
}))

const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: 'pre',
    '& thead': {
        '& tr': {
            '& th': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    },
    '& tbody': {
        '& tr': {
            '& td': {
                paddingLeft: 0,
                textTransform: 'capitalize',
            },
        },
    },
}))


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})


const InfoDialog = ({ singleData, open, handleClose, rowData }) => {
    const _logic = ProjectLogic()
    const _helpers = Helpers();
    const { palette, spacing } = useTheme()
    const textMuted = palette.text.secondary
    const bgPrimary = palette.primary.main
    const bgError = palette.error.main

    const [rowId, setRowId] = useState(null);
    const [SingleAttendanceLogs, setSingleAttendanceLogs] = useState([]);

    const [isRowClicked, setIsRowClicked] = useState(false);
    const [state, setState] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const { ID, location, empName } = rowData;

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

    const rowClick = (type, id) => {
        if (type === "rowClicked") {
            const refId = singleData[id];
            getSingleAttendanceLogs(refId.count)
        } else {
            const refId = id;
            getSingleAttendanceLogs(refId)

        }
        setIsRowClicked(false);
        setTimeout(() => {
            setIsRowClicked(true);
        }, 50)
    }


    const _displayTime = (dateTime) => {
        const time = dateTime.split("AT");
        return time[1];
    }

    const getSingleAttendanceLogs = async (count) => {
        const response = await _logic.getSingleAttendanceLogs(count);
        setSingleAttendanceLogs(response)
    }


    const columns = [
        {
            name: "date",
            label: "Date",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        {format(new Date(value).getTime(), 'MMMM dd, yyyy')}

                    </>
                }
            }
        },
        {
            name: "availabilityStatus", label: "Availability Status", options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <Sm bgcolor={_helpers.statusColor(value)}>
                        {value}
                    </Sm>
                }
            }
        },
        {
            name: "timeIn",
            label: "Time In",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        {value === null ? "-" :
                            <StyledSpan bgcolor={bgPrimary}>
                                {_displayTime(value)}
                            </StyledSpan>
                        }
                    </>
                }
            }
        },
        {
            name: "timeOut",
            label: "Time Out",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        {value === null ? "-" :
                            <StyledSpan bgcolor={bgError}>
                                {_displayTime(value)}
                            </StyledSpan>
                        }
                    </>
                }
            }
        },
        {
            name: "hourSpent",
            label: "Hour Spent",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <StyledSpan bgcolor={textMuted}>
                        {getTimeLogsTotalSpent(value)}
                    </StyledSpan>
                }
            }
        },
        {
            name: "count",
            label: "Action",
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Fab size='small' className="button" onClick={(e) => rowClick('buttoClicked', value)}>
                            <Icon fontSize='sm'>arrow_forward</Icon>
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
        filter: false,
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
        onRowClick: (rowData, rowIndex) => {
            console.log('rowIndex', rowIndex);
            const id = rowIndex.dataIndex;
            setRowId(id)
            rowClick('rowClicked', id)
        },
        setRowProps: (row, index) => {
            return { style: { backgroundColor: index === rowId ? 'lightgray' : "inherit", cursor: 'pointer' }, };
        },
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
        <Dialog
            fullScreen
            open={open}
            onClose={() => {
                handleClose(false);
                setRowId(null);
            }}
            TransitionComponent={Transition}
        >

            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            handleClose(false);
                            setRowId(null);
                        }}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <FlexBox>
                <Avatar
                    sx={{ height: 84, width: 84, mb: '20px' }}
                    src="null"
                />

                <Box m={2}>
                    <H2 >{empName || ""}</H2>
                    <H3 sx={{ color: textMuted }}>{location || ""}</H3>
                    <Small sx={{ color: textMuted }}>
                        {ID || ""}
                    </Small>
                </Box>
            </FlexBox>
            <SimpleCard>
                <Grid container spacing={6}>
                    <Grid item lg={8} md={8} sm={12}>
                        <CacheProvider value={muiCache}>
                            <ThemeProvider theme={createTheme()}>
                                <MUIDataTable
                                    title={"Attendance Record"}
                                    data={singleData}
                                    columns={columns}
                                    options={options}
                                />

                            </ThemeProvider>
                        </CacheProvider>
                    </Grid>
                    <Grid item lg={4} md={4} sm={12}>
                        <SimpleCard title={"Action Logs"}>
                            {isRowClicked
                                ?
                                <StyledTable>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Action</TableCell>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Work time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {SingleAttendanceLogs.map((subscriber, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="left">
                                                    {subscriber.statusAction}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {subscriber.name === "Time in"
                                                        ?
                                                        <StyledSpan bgcolor={bgPrimary}>
                                                            {_displayTime(subscriber.time)}
                                                        </StyledSpan>
                                                        :
                                                        <StyledSpan bgcolor={bgError}>
                                                            {_displayTime(subscriber.time)}
                                                        </StyledSpan>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {subscriber.timeSpent !== "0"
                                                        &&
                                                        <StyledSpan bgcolor={textMuted}>
                                                            {getTimeLogsTotalSpent(subscriber.timeSpent)}
                                                        </StyledSpan>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </StyledTable>
                                :
                                <>
                                </>
                            }
                        </SimpleCard>
                    </Grid>
                </Grid>
            </SimpleCard>
        </Dialog >
    );
};

export default InfoDialog;
