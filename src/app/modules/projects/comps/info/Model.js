import React, { useEffect, useState } from 'react';
import CommonLogic from 'app/logic/CommonLogic';
import ProjectLogic from '../../logic/ProjectLogic';
import { Container } from 'app/commons/StyledEl';
import { SimpleCard } from 'app/components';
import { useNavigate, useParams } from 'react-router-dom'
import { styled, useTheme } from '@mui/system'
import { Button, Box } from '@mui/material'
import {
    MatxSidenavContainer,
    MatxSidenav,
    MatxSidenavContent,
} from 'app/components'
import { useMediaQuery } from '@mui/material'
import { useSnackbar } from 'notistack'

import SideNav from './model/Sidenav';
import TopBar from './model/TopBar';
import Table from './model/Table';
import AddDialog from './model/AddDialog';
import { AlertConfirm } from 'app/commons';
import { setOverlayState } from 'app/redux/actions/commonActions';
import { useDispatch } from 'react-redux';



const Model = (props) => {
    const dispatch = useDispatch();
    const { id } = useParams()
    const _commonLogic = CommonLogic();
    const _logic = ProjectLogic();
    const path = _commonLogic.getUrlPath();
    const modelId = path[2];
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [selectedStatus, setSelectedStatus] = useState('All')
    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [spaces, setSpaces] = useState([])
    const [matterporIds, setmatterporIds] = useState([])


    useEffect(() => {
        getSpaces();
    }, []);

    const getSpaces = async () => {
        const data = {
            id: id,
            selectedStatus: selectedStatus
        }

        const response = await _logic.getSpaces(data);
        setSpaces(response);
    }

    const gotoSpace = async (modelId) => {
        _commonLogic.navigateTo(`/view-project/${modelId}`);
    }

    const toggleSidenav = () => {
        setOpen(!open)
    }

    useEffect(() => {
        if (isMobile) setOpen(false)
    }, [isMobile])


    const _setSelectedStatus = async (status) => {
        setSelectedStatus(status);
        const data = {
            id: id,
            selectedStatus: status
        }

        const response = await _logic.getSpaces(data);
        setSpaces(response);
    }

    const toggleAdd = async () => {
        dispatch(setOverlayState({ active: true, text: "" }))
        await getModels();
        setOpenDialog(true)
        dispatch(setOverlayState({ active: false, text: "" }))
    }

    const getModels = async () => {
        const response = await _logic.getModels();
        await setmatterporIds(response.models);
    }


    const _handleStatus = (spaceId, Status) => {
        AlertConfirm({
            callback: () => _confirmStatus(spaceId, Status),
            title: `Mark Project space as ${Status}?`,
            text: "Please confirm",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmStatus = async (spaceId, Status) => {
        const response = await _logic.updateSpaceStatus({ status: Status, spaceId: spaceId });
        if (response) {
            _setSelectedStatus(selectedStatus)
        }
    }


    return (
        <Box mx="4px" mb="4px">
            <MatxSidenavContainer>
                <MatxSidenav
                    width="220px"
                    toggleSidenav={toggleSidenav}
                    open={open}
                >
                    <SideNav
                        _setSelectedStatus={_setSelectedStatus}
                        toggleAdd={toggleAdd}
                    />
                </MatxSidenav>
                <MatxSidenavContent>
                    <TopBar
                        toggleSidenav={toggleSidenav}
                    />
                    <Box width="100%" overflow="auto">
                        <Table
                            spaces={spaces}
                            gotoSpace={gotoSpace}
                            _handleStatus={_handleStatus}
                        />
                    </Box>
                </MatxSidenavContent>
            </MatxSidenavContainer>

            <AddDialog
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                matterporIds={matterporIds}
                spaces={spaces}
                getSpaces={getSpaces}
                projectId={id}
            />

        </Box>
    );
};


export default Model;