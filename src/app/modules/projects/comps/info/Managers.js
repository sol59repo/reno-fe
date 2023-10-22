import React, { useState, useEffect } from 'react'
import { Box, Button, Icon, Avatar } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { AlertConfirm } from 'app/commons'
import ProjectLogic from '../../logic/ProjectLogic'
import Sidenav from './managers/Sidenav'
import Topbar from './managers/Topbar'
import Table from './managers/Table'
import {
    MatxSidenavContainer,
    MatxSidenav,
    MatxSidenavContent,
} from 'app/components'
import CommonLogic from "app/logic/CommonLogic"


const Managers = () => {

    const _commonLogic = CommonLogic();
    const path = _commonLogic.getUrlPath();
    const modelId = path[2];

    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const navigate = useNavigate();
    const _logic = ProjectLogic();
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [open, setOpen] = useState(false)
    const [managers, setManagers] = useState([])
    const [refManagersLists, setRefManagersLists] = useState([])
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))


    useEffect(() => {
        _getAsignedManager()
    }, []);

    const _getAsignedManager = async () => {
        const response = await _logic.getAsignedManager(modelId);
        setManagers(response);
        setRefManagersLists(response);
    }


    const toggleSidenav = () => {
        setOpen(!open)
    }

    const _viewManger = () => {

    }

    const _setSelectedStatus = (status) => {
        setSelectedStatus(status)
        if (status === "All") {
            setManagers(refManagersLists);
            return
        }
        _filterStaff(status)
    }

    const _filterStaff = (status) => {
        console.log(status);
        const filtered = refManagersLists.filter(val => val.status === status);
        setManagers(filtered);
    }



    const _handleStatus = (id, status) => () => {
        AlertConfirm({
            callback: () => _confirmStatus(id, status),
            title: `Mark Staff as ${status}?`,
            text: "Please confirm",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmStatus = async (id, status) => {
        const response = await _logic.updateAsignmentStatus({ status: status, count: id });
        if (response) {
            _getAsignedManager()
        }
    }


    useEffect(() => {
        if (isMobile) setOpen(false)
    }, [isMobile])


    return (
        <Box mx="4px" mb="4px">
            <MatxSidenavContainer>
                <MatxSidenav
                    width="220px"
                    toggleSidenav={toggleSidenav}
                    open={open}
                >
                    <Sidenav
                        refManagersLists={refManagersLists}
                        _setSelectedStatus={_setSelectedStatus}
                        _getAsignedManager={_getAsignedManager} />
                </MatxSidenav>
                <MatxSidenavContent>
                    <Topbar
                        toggleSidenav={toggleSidenav}
                    />
                    <Box width="100%" overflow="auto">
                        <Table managers={managers} _handleStatus={_handleStatus} _viewManger={_viewManger} />
                    </Box>
                </MatxSidenavContent>
            </MatxSidenavContainer>
        </Box>
    )
}


export default Managers;
