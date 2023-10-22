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
import AddStaffForm from './AddStaffForm';
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { styled } from '@mui/system'
import { AlertConfirm, Dialogs } from "../../../commons"
import CommonLogic from 'app/logic/CommonLogic';

const addModalProps = {
    Title: "New Employee",
    size: "lg",
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

const StaffSidenav = ({
    _submitNewStaff,
    _setSelectedStatus,

}) => {
    const _commonLogic = CommonLogic();
    const [open, setOpen] = React.useState(false)
    const handleClose = () => {
        setOpen(false)
    }

    console.log('_commonLogic', _commonLogic.getUsertype());

    return (
        <Container>
            {_commonLogic.getUsertype() === "Superadmin" &&
                <Tooltip title={"New Technician"}>
                    <StyledButton variant="contained" onClick={() => setOpen(true)}>
                        <Icon size="small" >add</Icon>
                        New Employee
                    </StyledButton>
                </Tooltip>
            }

            <ListItem button onClick={() => _setSelectedStatus('All')}>
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All Staffs" />
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
                    <AddStaffForm
                        _submitNewStaff={_submitNewStaff}
                        handleClose={handleClose}
                    />}

            />

        </Container>
    )
}

export default StaffSidenav
