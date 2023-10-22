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
import AddItem from './AddItem';
import { Dialogs } from 'app/commons';

const addModalProps = {
    Title: "",
    size: "md",
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
    _getAsignedMaterials,
    _setSelectedStatus,
    refMaterialsLists,
    projectInfo,
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
                    Manage Materials
                </StyledButton>
            </Tooltip>

            <ListItem button onClick={() => _setSelectedStatus('All')}>
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus('In-Stock')}>
                <ListItemIcon>
                    <Icon>check_box</Icon>
                </ListItemIcon>
                <ListItemText primary="In-Stock" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus('Out-of-Stock')}>
                <ListItemIcon>
                    <IndeterminateCheckBoxIcon className={'icon'} />
                </ListItemIcon>
                <ListItemText primary="Out-of-Stock" />
            </ListItem>

            <Divider />
            <Dialogs
                {...addModalProps}
                closeModal={() => setOpen(false)}
                open={open}
                Content={() =>
                    <AddItem
                        projectInfo={projectInfo}
                        refMaterialsLists={refMaterialsLists}
                        _getAsignedMaterials={_getAsignedMaterials}
                        handleClose={handleClose}
                    />}

            />

        </Container>
    )
}

export default Sidenav
