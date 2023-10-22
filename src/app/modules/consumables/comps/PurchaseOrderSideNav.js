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
import ConsumableComposeDialog from './ConsumableComposeDialog'
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

const PurchaseOrderSineNav = ({ _setSelectedStatus }) => {

    const [open, setOpen] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Container>
            <ListItem button onClick={() => _setSelectedStatus("All")}>
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All Orders" />
            </ListItem>

            <ListItem button onClick={() => _setSelectedStatus("For Approval")}>
                <ListItemIcon>
                    <Icon> remove_circle_outline</Icon>
                </ListItemIcon>
                <ListItemText primary="For Approval" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus("Approved")}>
                <ListItemIcon>
                    <Icon>check_box</Icon>
                </ListItemIcon>
                <ListItemText primary="Approved" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus("Acknowledged")}>
                <ListItemIcon>
                    <Icon>list</Icon>
                </ListItemIcon>
                <ListItemText primary="Acknowledged" />
            </ListItem>

            <Divider />

            <ListItem button onClick={() => _setSelectedStatus("Declined")}>
                <ListItemIcon>
                    <Icon color="secondary">archive</Icon>
                </ListItemIcon>
                <ListItemText primary="Declined" />
            </ListItem>
        </Container>
    )
}

export default PurchaseOrderSineNav;
