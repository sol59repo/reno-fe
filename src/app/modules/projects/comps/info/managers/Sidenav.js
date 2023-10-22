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
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { styled } from '@mui/system'
import { Dialogs } from "../../../../../commons"
import AsignManager from './AsignManager';

const addModalProps = {
    Title: "Choose From the list",
    size: "sm",
}


const Container = styled('div')(({ theme }) => ({
    marginRight: '16px',
    background: theme.palette.background.default,
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '100%',
    color: '#fff',
    paddingTop: '8px',
    paddingBottom: '8px',
    background: theme.palette.secondary.main,
}))

const Sidenav = ({
    _getAsignedManager,
    _setSelectedStatus,
    refManagersLists
}) => {
    const [open, setOpen] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Container>
            <Tooltip title={"Asign New Manager"}>
                <StyledButton variant="contained" onClick={() => setOpen(true)}>
                    <Icon size="small" >add</Icon>
                    Assign New Manager
                </StyledButton>
            </Tooltip>

            <ListItem button onClick={() => _setSelectedStatus('All')}>
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus('Active')}>
                <ListItemIcon>
                    <Icon>check_box</Icon>
                </ListItemIcon>
                <ListItemText primary="Active" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus('Inactive')}>
                <ListItemIcon>
                    <IndeterminateCheckBoxIcon className={'icon'} />
                </ListItemIcon>
                <ListItemText primary="Inactive" />
            </ListItem>

            <Divider />
            <ListItem button onClick={() => _setSelectedStatus('Archived')}>
                <ListItemIcon>
                    <Icon color="secondary">archive</Icon>
                </ListItemIcon>
                <ListItemText primary="Archived" />
            </ListItem>

            <Dialogs
                {...addModalProps}
                closeModal={() => setOpen(false)}
                open={open}
                Content={() =>
                    <AsignManager
                        refManagersLists={refManagersLists}
                        _getAsignedManager={_getAsignedManager}
                        handleClose={handleClose}
                    />}

            />

        </Container>
    )
}

export default Sidenav
