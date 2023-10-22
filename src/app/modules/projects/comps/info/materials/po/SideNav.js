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
import { Dialogs } from 'app/commons';
import NewPO from './NewPO';

const addModalProps = {
    Title: "",
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

const SideNav = ({
    _gePO,
    _getAllMaterials,
    _setSelectedStatus,
    projectInfo,
    materials
}) => {
    const [open, setOpen] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Container>
            <Tooltip title={"Manage Material"}>
                <StyledButton variant="contained" onClick={() => setOpen(true)}>
                    <Icon size="small" >add</Icon>
                    New PO
                </StyledButton>
            </Tooltip>

            <ListItem button onClick={() => _setSelectedStatus("All")}>
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All" />
            </ListItem>

            <ListItem button onClick={() => _setSelectedStatus("For Approval")}>
                <ListItemIcon>
                    <IndeterminateCheckBoxIcon className={'icon'} />
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
                    <Icon>done_all</Icon>
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

            <Dialogs
                {...addModalProps}
                closeModal={() => setOpen(false)}
                open={open}
                Content={() =>
                    <NewPO
                        _gePO={_gePO}
                        projectInfo={projectInfo}
                        materials={materials}
                        _getAllMaterials={_getAllMaterials}
                        handleClose={handleClose}
                    />}

            />

        </Container>
    )
}

export default SideNav
