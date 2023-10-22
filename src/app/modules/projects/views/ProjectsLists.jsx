import React, { useState, useEffect } from 'react';
import { Container } from "../../../commons/StyledEl"
import { Box } from '@mui/system'
import {
    SimpleCard,
    MatxSidenavContainer,
    MatxSidenav,
    MatxSidenavContent,
    Breadcrumb
} from 'app/components'
import { useSelector } from "react-redux"

import TableProjects from '../comps/TableProjects';
import ProjectTopBar from '../comps/ProjectTopBar';
import ProjectSidenav from '../comps/ProjectSidenav';
import ProjectLogic from '../logic/ProjectLogic'
import { AlertConfirm, Dialogs } from "../../../commons"
import { useNavigate } from 'react-router-dom'
import CommonLogic from 'app/logic/CommonLogic';



const ProjectsLists = (props) => {
    const navigate = useNavigate();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const { projectList } = useSelector(state => state.projects);
    const [open, setOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("All")

    const toggleSidenav = () => {
        setOpen(!open)
    }

    useEffect(async () => {
        await _logic.getLists({
            status: "All",
            usertype: _commonLogic.getUsertype(),
            loggedInId: _commonLogic.getCount()
        });

    }, []);

    const _handleDelete = (Model) => {
        console.log('Model', Model);
        AlertConfirm({
            callback: () => _confirmDelete(Model),
            title: 'Remove Model?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmDelete = async (Model) => {
        const response = await _logic.updateStatus({ status: "Deleted", Model: Model });
        if (response) {
            _logic.getLists({
                status: selectedStatus,
                usertype: _commonLogic.getUsertype(),
                loggedInId: _commonLogic.getCount()
            });
        }
    }

    const _viewProject = (Model) => {
        navigate(`/view-project/${Model}`);
    }


    const _handleStatus = (Model, Status) => {
        AlertConfirm({
            callback: () => _confirmStatus(Model, Status),
            title: `Mark Project as Archived?`,
            text: "Please confirm",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmStatus = async (Model, Status) => {
        const response = await _logic.updateStatus({ status: Status, Model: Model });
        if (response) {
            _logic.getLists({
                status: selectedStatus,
                usertype: _commonLogic.getUsertype(),
                loggedInId: _commonLogic.getCount()
            });
        }
    }


    return (
        <>
            <Container>
                <div className="breadcrumb">
                    <Breadcrumb
                        routeSegments={[
                            { name: 'Projects', path: '/projects/list' },
                        ]}
                    />
                </div>
                <Box mx="4px" mb="4px">
                    <MatxSidenavContainer>
                        <MatxSidenav
                            width="220px"
                            toggleSidenav={toggleSidenav}
                            open={open}
                        >
                            <ProjectSidenav
                                setSelectedStatus={setSelectedStatus}
                            />
                        </MatxSidenav>
                        <MatxSidenavContent>
                            <ProjectTopBar
                                toggleSidenav={toggleSidenav}
                            />
                            <Box width="100%" overflow="auto">
                                <TableProjects
                                    projectList={projectList}
                                    _handleStatus={_handleStatus}
                                    _handleDelete={_handleDelete}
                                    _viewProject={_viewProject}
                                />
                            </Box>
                        </MatxSidenavContent>
                    </MatxSidenavContainer>
                </Box>
            </Container>
        </>
    );
};


export default ProjectsLists;