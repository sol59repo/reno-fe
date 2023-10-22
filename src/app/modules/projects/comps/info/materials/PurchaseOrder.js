import React, { useState, useEffect } from 'react'
import { Box, Button, Icon, Avatar } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { AlertConfirm } from 'app/commons'
import ProjectLogic from '../../../logic/ProjectLogic'

import Table from './po/Table'
import TopBar from './po/TopBar'
import SideNav from './po/SideNav'

import {
    MatxSidenavContainer,
    MatxSidenav,
    MatxSidenavContent,
} from 'app/components'
import CommonLogic from "app/logic/CommonLogic"
import { Tab, Tabs, Divider, Grid } from '@mui/material'


const PurchaseOrder = ({ projectInfo }) => {
    const _commonLogic = CommonLogic();
    const path = _commonLogic.getUrlPath();
    const modelId = path[2];
    const { id } = useParams();

    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const navigate = useNavigate();
    const _logic = ProjectLogic();
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [open, setOpen] = useState(false)
    const [materials, setMaterials] = useState([])
    const [po, setPO] = useState([])
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const fkProject = projectInfo[0].count

    useEffect(() => {
        _getAllMaterials()
        _gePO()
    }, []);


    const _getAllMaterials = async () => {
        const response = await _logic.getAllMaterials();
        setMaterials(response);
    }

    const _gePO = async () => {
        const data = {
            status: selectedStatus,
            modelId: modelId
        }
        const response = await _logic.gePO(data);
        setPO(response);
    }


    const toggleSidenav = () => {
        setOpen(!open)
    }


    const _handleStatus = (count, status) => {
        AlertConfirm({
            callback: () => _confirmStatus(count, status),
            title: `Acknowledge Orders?`,
            text: "Please confirm",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "Later!"
        });
    }

    const _confirmStatus = async (count, status) => {
        const orderResponse = await _logic.getPoDetails(count);

        const data = {
            ProjectCount: fkProject,
            count: count,
            status: status,
            Items: orderResponse,
            addedby: _commonLogic.getCount(),
            modelId: id

        }
        const response = await _logic.acknowledgeOrders(data);
        if (response) {
            _gePO()
        }
    }

    useEffect(() => {
        if (isMobile) setOpen(false)
    }, [isMobile])


    const _setSelectedStatus = (status) => {
        setSelectedStatus(status)
        _filterStatus(status)
    }

    const _filterStatus = async (status) => {
        const data = {
            status: status,
            modelId: modelId
        }
        const response = await _logic.gePO(data);
        setPO(response);
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
                        _gePO={_gePO}
                        _setSelectedStatus={_setSelectedStatus}
                        materials={materials}
                        projectInfo={projectInfo}
                        _getAllMaterials={_getAllMaterials} />
                </MatxSidenav>
                <MatxSidenavContent>
                    <TopBar
                        toggleSidenav={toggleSidenav}
                    />
                    <Box width="100%" overflow="auto">
                        <Table
                            po={po}
                            materials={materials}
                            _handleStatus={_handleStatus}
                        />
                    </Box>
                </MatxSidenavContent>
            </MatxSidenavContainer>
        </Box>
    )
}


export default PurchaseOrder;
