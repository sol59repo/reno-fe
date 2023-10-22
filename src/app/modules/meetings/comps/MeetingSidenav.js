import {
    Icon,
    Divider,
    Button,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip
} from '@mui/material'
import React from 'react'
import MeetingComposeDialog from './MeetingComposeDialog'
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { styled } from '@mui/system'

const Container = styled('div')(({ theme }) => ({
    marginRight: '16px',
    background: theme.palette.background.default,
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '100%',
    color: '#fff',
    paddingTop: '8px',
    paddingBottom: '8px',
    background: theme.palette.error.main,
}))

const MeetingSidenav = ({_submitNewTicket,_setSelectedStatus}) => {
    const [open, setOpen] = React.useState(false)
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Container>
            <Tooltip title={"New Ticket"}>
                <StyledButton variant="contained" onClick={() => setOpen(true)}>
                    <Icon size="small" >add</Icon>
                    New Meeting
                </StyledButton>
            </Tooltip>

            <ListItem button onClick={()=>_setSelectedStatus('All')}>
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All Meetings" />
            </ListItem>
             <ListItem button onClick={()=>_setSelectedStatus('Completed')}>
                <ListItemIcon>
                    <Icon>check_box</Icon>
                </ListItemIcon>
                <ListItemText primary="Done" />
            </ListItem>
             <ListItem button onClick={()=>_setSelectedStatus('Pending')}>
                <ListItemIcon>
                    <Icon>remove_circle_outline</Icon>
                </ListItemIcon>
                <ListItemText primary="Pending" />
            </ListItem>

            <Divider />

             <ListItem button onClick={()=>_setSelectedStatus('Archived')}>
                <ListItemIcon>
                    <Icon color="secondary">archive</Icon>
                </ListItemIcon>
                <ListItemText primary="Archived" />
            </ListItem>

            <MeetingComposeDialog _submitNewTicket={_submitNewTicket} open={open} handleClose={handleClose} />
        </Container>
    )
}

export default MeetingSidenav
