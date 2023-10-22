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
    _setSelectedStatus,
    toggleAdd
}) => {

    return (
        <Container>
            <Tooltip title={"Manage Material"}>
                <StyledButton variant="contained" onClick={() => toggleAdd()}>
                    <Icon size="small" >add</Icon>
                    New Space/Model
                </StyledButton>
            </Tooltip>

            <ListItem button onClick={() => _setSelectedStatus("All")}>
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All" />
            </ListItem>

            <ListItem button onClick={() => _setSelectedStatus("Pending")}>
                <ListItemIcon>
                    <IndeterminateCheckBoxIcon className={'icon'} />
                </ListItemIcon>
                <ListItemText primary="Pending" />
            </ListItem>

            <ListItem button onClick={() => _setSelectedStatus("Finished")}>
                <ListItemIcon>
                    <Icon>check_box</Icon>
                </ListItemIcon>
                <ListItemText primary="Finished" />
            </ListItem>

            <ListItem button onClick={() => _setSelectedStatus("Inprogress")}>
                <ListItemIcon>
                    <Icon>done_all</Icon>
                </ListItemIcon>
                <ListItemText primary="Inprogress" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => _setSelectedStatus("Archived")}>
                <ListItemIcon>
                    <Icon color="secondary">archive</Icon>
                </ListItemIcon>
                <ListItemText primary="Archived" />
            </ListItem>

        </Container>
    )
}

export default Sidenav
