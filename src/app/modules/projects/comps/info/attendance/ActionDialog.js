import React, { useState, useEffect } from 'react'
import {
    Dialog, Grid,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Icon,
    Fab,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    Button,
    Table
} from '@mui/material';

import { Box, useTheme, styled } from '@mui/system'
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic';
import { format } from 'date-fns';
import { AlertConfirm } from 'app/commons';
import { DialogTitle } from 'app/commons';
import Helpers from 'app/utils/Helpers'
import { useSnackbar } from 'notistack'
import { SimpleCard } from 'app/components';
import { getTimeLogsDifference, getTimeLogsTotalSpent } from 'utils';
import { Span } from 'app/components/Typography'


const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}))

const StyledSpan = styled(Span)(({ bgColor }) => ({
    color: '#fff',
    padding: '3px 10px',
    borderRadius: '2px',
    background: bgColor,
    width: "50%",
    textAlign: 'center',
    margin: 10
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

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    minWidth: 300
}))

const JustifyBox = styled(FlexBox)(() => ({
    flexDirection: 'row',
    justifyContent: 'space-around',

}))


const SnackbarRoot = styled('div')(({ theme }) => ({
    maxWidth: 600,
    '& .snackbar': {
        margin: theme.spacing(1),
        background: "rgb(255, 61, 87)"
    },
}))




export const ActionDialog = ({
    open,
    setOpen,
    dialogData,
    getSingleAttendance,
    getAttendance,
    SingleAttendanceLogs,
    getSingleAttendanceLogs,
    modelId
}) => {

    const { enqueueSnackbar } = useSnackbar()
    const _logic = ProjectLogic();
    const _helpers = Helpers();
    const { palette } = useTheme()
    const textMuted = palette.text.secondary
    const bgPrimary = palette.primary.main
    const bgError = palette.error.main


    const {
        count,
        date,
        empName,
        fkUser,
        hourSpent,
        status,
        timeIn,
        timeOut,
        availabilityStatus
    } = dialogData;



    const [selectedStatus, setSelectedStatus] = useState('');

    const displayStatusText = (status) => {
        switch (status) {
            case "In":
                return "Time Out";
            case "Out":
                return "Time In";
            default:
                return "Time In";
        }
    }

    const statusAction = (status) => {
        switch (status) {
            case "In":
                return "Out";
            case "Out":
                return "In";
            default:
                return "In";
        }
    }

    const handLeAction = (statusAction) => {
        AlertConfirm({
            callback: () => submitAction(statusAction),
            title: 'Update time in logs?',
            text: "Please confirm",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }


    const submitAction = async (statusAction) => {
        let formattedTimeStamp;

        const data = {
            count: count,
            status: statusAction,
        }

        if (statusAction === "In") {
            formattedTimeStamp = format(new Date(), "MMM d yyyy 'at' h:m a").toUpperCase();
            data.time = formattedTimeStamp;
            data.hourSpent = SingleAttendanceLogs.length === 0 ? 0 : hourSpent
            data.timeSpent = 0;
        } else {
            formattedTimeStamp = format(new Date(), "MMM d yyyy 'at' h:m a").toUpperCase();
            data.time = formattedTimeStamp;

            const from = SingleAttendanceLogs[SingleAttendanceLogs.length - 1].time.replace('AT', '');
            const to = formattedTimeStamp.replace('AT', '');
            const timeDiffs = getTimeLogsDifference(new Date(to), new Date(from));
            data.timeSpent = timeDiffs;
            data.hourSpent = parseFloat(hourSpent) + parseFloat(timeDiffs);
        }


        // console.log(data);

        // return ;
        const body = JSON.stringify(data);
        const response = await _logic.submitAction(body);
        if (response) {
            getSingleAttendance(count);
            getSingleAttendanceLogs(count)
            getAttendance()
            setSelectedStatus("");
        }
    }

    const handleChange = (event) => {
        setSelectedStatus(event.target.value);
    }

    const _handleUpdate = () => {
        AlertConfirm({
            callback: () => updateAvailability(),
            title: 'Update availability status?',
            text: "Please confirm",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }


    const updateAvailability = async () => {
        if (selectedStatus === "") {
            enqueueSnackbar(`Please select status!`, { variant: 'error' });
            return;
        }

        const response = await _logic.updateAttendanceAvailability({
            count: count,
            availabilityStatus: selectedStatus
        });
        if (response) {
            getSingleAttendance(count);
            getAttendance()
            setSelectedStatus("");
        }
    }

    const handleClose = () => {
        setSelectedStatus("");
        setOpen(false)
    }


    console.log('SingleAttendanceLogs', SingleAttendanceLogs);

    const _displayTime = (dateTime) => {
        const time = dateTime.split("AT");
        return time[1];
    }

    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth={true}
            onClose={() => handleClose()}
            aria-labelledby="actionDialog"
        >
            <DialogTitle
                id="actionDialog"
                style={{ backgroundColor: "lightGray" }}>
                {empName || ""}
            </DialogTitle>

            <Box p={3}>
                <Box sx={{ minWidth: 120 }}>
                    <SimpleCard title={"Availability"}>
                        <JustifyBox>
                            <FlexBox>
                                <FormControl fullWidth>
                                    <InputLabel id="selectAvailabilty">Availability  Status</InputLabel>
                                    <Select
                                        labelId="selectAvailabilty"
                                        id="selectAvailabilty-select"
                                        value={selectedStatus}
                                        label="Availability  Status"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"Absent"}>Absent</MenuItem>
                                        <MenuItem value={"Present"}>Present</MenuItem>
                                        <MenuItem value={"Leave"}>Leave</MenuItem>
                                    </Select>
                                </FormControl>
                            </FlexBox>
                            <FlexBox>
                                <JustifyBox>
                                    <StyledSpan bgcolor={_helpers.statusColor(availabilityStatus)}>
                                        {availabilityStatus === "" ? "---" : availabilityStatus}
                                    </StyledSpan>
                                    {selectedStatus === "" ? <></> : <Fab
                                        variant="extended"
                                        aria-label="Delete"
                                        className="button"
                                        color='success'
                                        onClick={_handleUpdate}
                                    >
                                        <Icon sx={{ mr: 1 }}>check</Icon>
                                        Submit
                                    </Fab>}

                                </JustifyBox>
                            </FlexBox>
                        </JustifyBox>
                    </SimpleCard>
                    <Box py={2} />
                    <SimpleCard title={"Action Logs"}>
                        {
                            availabilityStatus === "Present" &&
                            <>
                                <StyledButton
                                    variant="outlined"
                                    color="success"
                                    style={{ width: '100%' }}
                                    onClick={() => handLeAction(statusAction(status))}
                                >
                                    {displayStatusText(status)}
                                </StyledButton>
                                <JustifyBox>
                                    <Grid container spacing={6}>
                                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                            <StyledTable>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Action</TableCell>
                                                        <TableCell>Time</TableCell>
                                                        <TableCell>Work time</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {SingleAttendanceLogs.map((value, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell align="left">
                                                                {value.statusAction}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {value.statusAction === "Time in"
                                                                    ?
                                                                    <StyledSpan bgcolor={bgPrimary}>
                                                                        {_displayTime(value.time)}
                                                                    </StyledSpan>
                                                                    :
                                                                    <StyledSpan bgcolor={bgError}>
                                                                        {_displayTime(value.time)}
                                                                    </StyledSpan>
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {value.timeSpent !== "0"
                                                                    &&
                                                                    <StyledSpan bgcolor={textMuted}>
                                                                        {getTimeLogsTotalSpent(parseFloat(value.timeSpent))}
                                                                    </StyledSpan>
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </StyledTable>
                                        </Grid>
                                    </Grid>
                                </JustifyBox>
                            </>
                        }
                    </SimpleCard>
                </Box>
            </Box>
        </Dialog>
    );
}
