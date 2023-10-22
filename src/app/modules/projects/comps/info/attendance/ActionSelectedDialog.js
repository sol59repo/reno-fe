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



export const ActionSelectedDialog = ({
    handleClose,
    open,
    selectedData

}) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleChange = (event) => {
        setSelectedStatus(event.target.value);
    }

    const _handleSubmit = (event) => {

    }

    console.log('selectedData', selectedData);

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
                Selected Names
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
                                    <Fab
                                        disabled={selectedStatus === "" ? true : false}
                                        variant="extended"
                                        aria-label="Delete"
                                        className="button"
                                        color='success'
                                        onClick={_handleSubmit}
                                    >
                                        <Icon sx={{ mr: 1 }}>check</Icon>
                                        Submit
                                    </Fab>
                                </JustifyBox>
                            </FlexBox>
                        </JustifyBox>
                    </SimpleCard>
                    <Box py={2} />
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedData?.map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell align="left">
                                        {value.empName}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>

                </Box>
            </Box >
        </Dialog >
    );
}

