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
import ProjectComposeDialog from './ProjectComposeDialog'
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { styled } from '@mui/system'
import { useSelector } from 'react-redux';
import ProjectLogic from '../logic/ProjectLogic';
import CommonLogic from 'app/logic/CommonLogic';

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

const ProjectSidenav = ({ setSelectedStatus }) => {
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const { projectList } = useSelector(state => state.projects);
    const [open, setOpen] = React.useState(false)
    const handleClose = () => {
        setOpen(false)
    }

    const selectStatus = (stats) => {
        setSelectedStatus(stats)
        const status = {
            status: stats,
            usertype: _commonLogic.getUsertype(),
            loggedInId: _commonLogic.getCount()
        }
        _logic.getLists(status);
    }

    return (
        <Container>
            <Tooltip title={"New Project"}>
                {/* <StyledButton variant="contained" onClick={() => test()}> */}
                <StyledButton variant="contained" onClick={() => setOpen(true)}>
                    <Icon size="small" >add</Icon>
                    New Project
                </StyledButton>
            </Tooltip>

            <ListItem button onClick={() => selectStatus("All")} >
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All Projects" />
            </ListItem>
            <ListItem button onClick={() => selectStatus("Finished")} >
                <ListItemIcon>
                    <Icon>check_box</Icon>
                </ListItemIcon>
                <ListItemText primary="Finished" />
            </ListItem>
            <ListItem button onClick={() => selectStatus("Inprogress")} >
                <ListItemIcon>
                    <Icon>timer</Icon>
                </ListItemIcon>
                <ListItemText primary="Inprogress" />
            </ListItem>
            <ListItem button onClick={() => selectStatus("Pending")} >
                <ListItemIcon>
                    <IndeterminateCheckBoxIcon className={'icon'} />
                </ListItemIcon>
                <ListItemText primary="Pending" />
            </ListItem>

            <Divider />

            <ListItem button onClick={() => selectStatus("Archived")} >
                <ListItemIcon>
                    <Icon color="secondary">archive</Icon>
                </ListItemIcon>
                <ListItemText primary="Archived" />
            </ListItem>

            <ProjectComposeDialog open={open} handleClose={handleClose} projectList={projectList} />
        </Container>
    )
}

export default ProjectSidenav
