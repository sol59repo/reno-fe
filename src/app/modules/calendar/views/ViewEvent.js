import { Box, styled, useTheme } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { H4 } from 'app/components/Typography'
import { Dialog, IconButton, Button, Icon, Grid, TextField, Divider } from '@mui/material'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker2 from '@mui/lab/DateTimePicker'
import { AutoComplete } from 'app/commons/StyledEl'
import { useSnackbar } from 'notistack'
import CalendarLogic from '../logic/CalendarLogic'
import CommonLogic from 'app/logic/CommonLogic'
import { Small } from 'app/components/Typography'
import format from 'date-fns/format'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import CalendarToday from '@mui/icons-material/CalendarToday';
import EventNote from '@mui/icons-material/EventNote';
import Call from '@mui/icons-material/Call';
import Email from '@mui/icons-material/Email';
import People from '@mui/icons-material/People';
import { MatxMenu } from 'app/components'
import { Span } from 'app/components/Typography'
import { AlertConfirm } from 'app/commons'
import { useNavigate } from 'react-router-dom'

import {
    Checkbox,
    Avatar,
    FormControlLabel,
    Tooltip
} from '@mui/material'


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
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

const StyledAvatar = styled(Avatar)(() => ({
    height: '30px',
    width: '30px',
}))


const ViewEvent = ({ event = {}, open, handleViewEventClose, attendees, managers, getMeetingAttendee, getMeetings }) => {
    const { enqueueSnackbar } = useSnackbar()
    const _logic = CalendarLogic()
    const _commonLogic = CommonLogic()
    const { palette } = useTheme()
    const textMuted = palette.text.secondary

    const [state, setState] = useState({});

    useEffect(() => {
        setState({ ...state, cardMembers: attendees });
    }, [attendees]);


    const gotoZoom = async () => {
        const response = await _logic.getZoomLink(event?.host);
        if (response) {
            const { zoomLink } = response[0];
            window.open(zoomLink)
        }
    }

    const handleFormSubmit = async () => {

    }

    const handleChange = (InputEvent) => {

        if (event.host != _commonLogic.getCount()) {
            enqueueSnackbar(`Only meeting host can able to update attendees!`, { variant: 'error' });
            return;
        }

        let id = InputEvent.target.value
        if (!InputEvent.target.checked) {
            removeAttendee(id) // manager count
        } else {
            _addParticipants(id) // manager count
        }
    }


    const _addParticipants = async (id) => {
        const body = {
            fkMeetingCount: event?.count,
            fkUserCount: id,
            attendStatus: "Active"
        }

        const response = await _logic.addParticipants(body);
        if (response.status) {
            getMeetingAttendee(event?.count);
        }
    }


    const removeAttendee = async (id) => {
        const response = await _logic.removeAttendee({ count: id, meetingCount: event?.count });
        if (response) {
            getMeetingAttendee(event?.count);
        }
    }

    const _handleDelete = () => {
        AlertConfirm({
            callback: () => removeMeeting(),
            title: 'Remove meeting?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const removeMeeting = async () => {
        const response = await _logic.removeMeeting({ meetingCount: event?.count });
        if (response) {
            await getMeetings();
            await handleViewEventClose()
        }
    }

    console.log('event', event);

    const { title, schedule, email, type, notes } = event
    const { cardMembers } = state

    return (
        <Dialog
            onClose={handleViewEventClose}
            open={open}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogHeader>
                {event.host !== _commonLogic.getCount() &&
                    (<IconButton onClick={_handleDelete}>
                        <Icon sx={{ color: '#fff' }}>delete</Icon>
                    </IconButton>)
                }
                <IconButton onClick={handleViewEventClose}>
                    <Icon sx={{ color: '#fff' }}> clear</Icon>
                </IconButton>
            </DialogHeader>

            <Box p={1}>
                <ValidatorForm onSubmit={handleFormSubmit}>

                    <List sx={{ width: '100%', bgcolor: 'background.paper', py: 0 }} >
                        <ListItem>
                            <ListItemIcon>
                                <CalendarToday />
                            </ListItemIcon>
                            <ListItemText
                                primary={title?.toUpperCase()}
                                secondary={schedule != undefined ? format(new Date(schedule), "MMM d, yyyy 'at' h:m a") : ""}
                            />
                        </ListItem>
                        
                        <ListItem>
                            <ListItemIcon>
                                <EventNote />
                            </ListItemIcon>
                            <ListItemText
                                primary={notes}
                            />
                        </ListItem>

                        {type === "Virtual" &&
                            <ListItem button onClick={gotoZoom}>
                                <ListItemIcon>
                                    <Call />
                                </ListItemIcon>
                                <ListItemText
                                    primary={"Zoom Meeting Link"}
                                    secondary={""}
                                    sx={{ textDecoration: 'underline', color: 'blue' }}
                                />
                            </ListItem>
                        }


                        <ListItem >
                            <ListItemIcon>
                                <Email />
                            </ListItemIcon>
                            <ListItemText
                                primary={email}
                                secondary={"Host"}
                            />
                        </ListItem>
                    </List>

                    <List sx={{ py: 0, width: '100%' }} >

                        <MatxMenu
                            horizontalPosition="right"
                            shouldCloseOnItemClick={false}
                            menuButton={
                                <ListItemButton sx={{ width: "100%" }}>
                                    <ListItemIcon>
                                        <People />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{ width: "100%" }}
                                        primary={'Guests'}
                                    />
                                </ListItemButton>
                            }
                        >
                            {managers?.map((user) => (
                                <FormControlLabel
                                    sx={{ ml: 0 }}
                                    key={user.ID}
                                    control={
                                        <Checkbox
                                            name="avatar"
                                            checked={cardMembers?.some(
                                                (member) =>
                                                    user.count ==
                                                    member.fkUsercount
                                            )}
                                            onChange={handleChange}
                                            value={user.count}
                                        />
                                    }
                                    label={
                                        <FlexBox>
                                            <StyledAvatar
                                                src={user.avatar}
                                                sizes={'24'}
                                            />
                                            <Span
                                                sx={{ ml: '12px' }}
                                            >
                                                {user.name}
                                            </Span>
                                        </FlexBox>
                                    }
                                />
                            ))}
                        </MatxMenu>
                    </List>
                    <Box
                        ml="-0.875rem"
                        display="flex"
                        position="relative"
                        sx={{ marginLeft: 5 }} >
                        {attendees?.map((member) => (
                            <Tooltip
                                title={member.name}
                                fontSize="large"
                                key={member.fkUsercount.toString()}
                            >
                                <StyledAvatar
                                    key={member.fkUsercount}
                                    src={member.avatar}
                                />
                            </Tooltip>
                        ))}
                    </Box>
                    <Divider sx={{ m: 3 }} />

                </ValidatorForm>
            </Box >
        </Dialog >
    )
}

export default ViewEvent
