import React, { useState, useEffect } from 'react'
import { Box, Button, Icon, Avatar } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { AlertConfirm } from 'app/commons'
import ProjectLogic from '../../../logic/ProjectLogic'
import Topbar from './consumed/Topbar'
import Table from './consumed/Table'
import Sidenav from './consumed/Sidenav'
import {
    MatxSidenavContainer,
    MatxSidenav,
    MatxSidenavContent,
} from 'app/components'
import CommonLogic from "app/logic/CommonLogic"
import { Tab, Tabs, Divider, Grid } from '@mui/material'


const Consumed = ({ projectInfo }) => {

    const _commonLogic = CommonLogic();
    const path = _commonLogic.getUrlPath();
    const modelId = path[2];

    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const navigate = useNavigate();
    const _logic = ProjectLogic();
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [open, setOpen] = useState(false)
    const [materials, setMaterials] = useState([])
    const [refMaterialsLists, setRefMaterialsLists] = useState([])
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [tabIndex, setTabIndex] = useState(0)

    const { count } = projectInfo[0]

    console.log('count',count);


    useEffect(() => {
        _getAsignedMaterials()
    }, []);


    const _getAsignedMaterials = async () => {
        const response = await _logic.getAsignedMaterials(count);
        setMaterials(response);
        setRefMaterialsLists(response);
    }


    const toggleSidenav = () => {
        setOpen(!open)
    }

    const _viewManger = () => {

    }

    const _setSelectedStatus = (status) => {
        setSelectedStatus(status)
        if (status === "All") {
            setMaterials(refMaterialsLists);
            return
        }
        _filterStaff(status)
    }

    const _filterStaff = (status) => {
        console.log(status);
        const filtered = refMaterialsLists.filter(val => val.status === status);
        setMaterials(filtered);
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
        const response = await _logic.updateAdeddConsumableStatus({ status: status, count: id });
        if (response) {
            _getAsignedMaterials()
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
                        projectInfo={projectInfo}
                        refMaterialsLists={refMaterialsLists}
                        _setSelectedStatus={_setSelectedStatus}
                        _getAsignedMaterials={_getAsignedMaterials} />
                </MatxSidenav>
                <MatxSidenavContent>
                    <Topbar
                        toggleSidenav={toggleSidenav}
                    />
                    <Box width="100%" overflow="auto">
                        <Table materials={materials} _handleStatus={_handleStatus} _viewManger={_viewManger} />
                    </Box>
                </MatxSidenavContent>
            </MatxSidenavContainer>
        </Box>
    )
}


export default Consumed;
