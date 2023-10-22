import React, { useState, useEffect } from 'react'
import { Box, Button, Icon, Avatar } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { AlertConfirm } from 'app/commons'
import ProjectLogic from '../../logic/ProjectLogic'
import Sidenav from './staffs/Sidenav'
import Topbar from './staffs/Topbar'
import Table from './staffs/Table'
import {
    MatxSidenavContainer,
    MatxSidenav,
    MatxSidenavContent,
} from 'app/components'
import CommonLogic from "app/logic/CommonLogic"


const Staffs = () => {

    const _commonLogic = CommonLogic();
    const path = _commonLogic.getUrlPath();
    const modelId = path[2];

    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const navigate = useNavigate();
    const _logic = ProjectLogic();
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [open, setOpen] = useState(false)
    const [staffs, setStaffs] = useState([])
    const [refStaffsLists, setRefStaffsLists] = useState([])
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))


    useEffect(() => {
        _getAsignedStaff()
    }, []);

    const _getAsignedStaff = async () => {
        const response = await _logic.getAsignedStaff(modelId);
        setStaffs(response);
        setRefStaffsLists(response);
    }


    const toggleSidenav = () => {
        setOpen(!open)
    }

    const _viewStaff = () => {

    }

    const _setSelectedStatus = (status) => {
        setSelectedStatus(status)
        if (status === "All") {
            setStaffs(refStaffsLists);
            return
        }
        _filterTechnician(status)
    }

    const _filterTechnician = (status) => {
        console.log(status);
        const filtered = refStaffsLists.filter(val => val.status === status);
        setStaffs(filtered);
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
            _getAsignedStaff()
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
                        refStaffsLists={refStaffsLists}
                        _setSelectedStatus={_setSelectedStatus}
                        _getAsignedStaff={_getAsignedStaff}
                        />
                </MatxSidenav>
                <MatxSidenavContent>
                    <Topbar
                        toggleSidenav={toggleSidenav}
                    />
                    <Box width="100%" overflow="auto">
                        <Table staffs={staffs} _handleStatus={_handleStatus} _viewStaff={_viewStaff} />
                    </Box>
                </MatxSidenavContent>
            </MatxSidenavContainer>
        </Box>
    )
}


export default Staffs;
