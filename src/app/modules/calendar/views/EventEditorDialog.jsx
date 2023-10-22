import { Box, styled } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { H4 } from 'app/components/Typography'
import { Dialog, IconButton, Button, Icon, Grid, TextField, SnackbarContent } from '@mui/material'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker2 from '@mui/lab/DateTimePicker'
import { AutoComplete } from 'app/commons/StyledEl'
import { useSnackbar } from 'notistack'
import CalendarLogic from '../logic/CalendarLogic'
import CommonLogic from 'app/logic/CommonLogic'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Checkbox from '@mui/material/Checkbox';

const SnackbarRoot = styled('div')(({ theme }) => ({
    width: "100%",
    '& .snackbar': {
        margin: theme.spacing(1),
    },
}))



const DialogFooter = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
}))

const DialogHeader = styled(DialogFooter)(({ theme }) => ({
    padding: "10px 15px",
    background: theme.palette.primary.main
}))

const EventEditorDialog = ({ event = {}, open, handleClose, managers, zoomLink, getMeetings, gotoProfile }) => {
    const { enqueueSnackbar } = useSnackbar()
    const _logic = CalendarLogic()
    const _commonLogic = CommonLogic()

    const [state, setState] = useState({})
    const [selected, setSelected] = useState([])
    const [isNotAllowed, setIsNotAllowed] = useState(false)
    const [checked, setChecked] = React.useState(false);


    useEffect(() => {
        const { slots } = event;
        const slotDate = new Date(slots[0]);
        setState({
            ...state,
            schedule: slotDate,
        })
    }, []);


    const action = (
        <Button color="secondary" size="small" onClick={gotoProfile}>
            Go to Profile
        </Button>
    )

    const handleCheckBoxChange = (event) => {
        setChecked(event.target.checked);
        if (zoomLink === "") {
            setIsNotAllowed(event.target.checked)
        } else {
            setIsNotAllowed(false)
        }
    };

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value })
    }

    const onChange = (actionMeta, newValue) => {
        if (newValue === null) { return }

        console.log('newValue', newValue);

        setSelected(newValue)
    }

    const isInThePast = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return date < today;
    }


    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (isNotAllowed) {
            return;
        }

        if (selected.length === 0) {
            enqueueSnackbar(`Please add meeting attendee!`, { variant: 'error' });
            return;
        }

        if (isInThePast(schedule)) {
            enqueueSnackbar(`Please enter valid schedule!`, { variant: 'error' });
            return;
        }


        const host = {
            ID: _commonLogic.getId(),
            avatar: "",
            count: _commonLogic.getCount(),
            name: _commonLogic.getName()
        }
        const concatHostAsAttendee = [...selected, host]

        const data = {
            title: title,
            schedule: schedule,
            atendees: concatHostAsAttendee,
            note: note,
            host: _commonLogic.getCount(),
            type: checked ? "Virtual" : "Not"

        }

        const response = await _logic.createCalendarMeeting(data);

        if (response.status) {
            getMeetings()
            handleClose()
            setState({})
        }
    }

    const handleDateChange = (date, name) => {
        setState({
            ...state,
            [name]: date,
        })
    }



    let { title, schedule, note } = state

    console.log('isNotAllowed', isNotAllowed);

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogHeader>
                <H4 sx={{ m: 0, color: '#fff' }}>Add Event</H4>
                <IconButton onClick={handleClose}>
                    <Icon sx={{ color: '#fff' }}>clear</Icon>
                </IconButton>
            </DialogHeader>

            <Box p={2}>
                {isNotAllowed &&
                    (<SnackbarRoot>
                        <SnackbarContent
                            className='snackbar'
                            message="You must have added your zoom personal link to create a zoom event."
                            action={action}
                        />
                    </SnackbarRoot>)
                }


                <ValidatorForm onSubmit={handleFormSubmit}>
                    <TextValidator
                        label="Title"
                        type="text"
                        name="title"
                        value={title || ''}
                        onChange={handleChange}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        style={{ width: '100%', marginBottom: '24px' }}
                    />

                    <Grid container spacing={4}>
                        <Grid item sm={12} xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker2
                                    value={schedule}
                                    onChange={(date) =>
                                        handleDateChange(date, 'schedule')}
                                    renderInput={(props) => (
                                        <TextField
                                            {...props}
                                            label="Schedule"
                                            variant="standard"
                                            validators={[
                                                'required'
                                            ]}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <Box py={1.3} />

                    <FormControlLabel
                        control={
                            <Checkbox checked={checked} onChange={handleCheckBoxChange} name="checked" />
                        }
                        label="Virtual Meeting"
                    />

                    <Box py={1.3} />

                    <TextValidator
                        label="Note"
                        onChange={handleChange}
                        type="text"
                        name="note"
                        value={note || ''}
                        rowsMax={2}
                        multiline={true}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        style={{ width: '100%', marginBottom: '24px' }}
                    />

                    <AutoComplete
                        multiple
                        options={managers}
                        getOptionLabel={(option) => option.name.toString()}
                        onChange={onChange}
                        value={selected}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Attendees(managers)"
                                fullWidth
                            />
                        )}
                    />


                    <DialogFooter>
                        <Button
                            variant="contained"
                            color="primary"
                            type='sumbit'
                            disabled={isNotAllowed}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </ValidatorForm>
            </Box>
        </Dialog >
    )
}

export default EventEditorDialog
