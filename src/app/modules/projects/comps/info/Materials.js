import React, { useState, useEffect } from 'react'
import { Box, Button, Icon, Avatar } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { AlertConfirm } from 'app/commons'
import ProjectLogic from '../../logic/ProjectLogic'
import CommonLogic from "app/logic/CommonLogic"
import { Tab, Tabs, Divider } from '@mui/material'
import Consumed from './materials/Consumed'
import PurchaseOrder from './materials/PurchaseOrder'
import Logs from './materials/Logs'


const Materials = ({ projectInfo }) => {
    const _commonLogic = CommonLogic();
    const path = _commonLogic.getUrlPath();
    const modelId = path[2];
    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const _logic = ProjectLogic();
    const [open, setOpen] = useState(false)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [tabIndex, setTabIndex] = useState(0)

    const { count } = projectInfo[0]

    useEffect(() => {
        _getAsignedPO()
    }, []);

    const handleTabChange = (e, value) => {
        setTabIndex(value)
    }


    const renderTabs = () => {
        const tabList = ['Consumed', 'Orders', 'Logs']
        const _tabs = tabList.map((item, ind) => (<Tab
            key={ind}
            value={ind}
            label={item}
            sx={{ textTransform: 'capitalize' }}
        />))
        return _tabs
    }

    const _getAsignedPO = async () => {

    }

    useEffect(() => {
        if (isMobile) setOpen(false)
    }, [isMobile])


    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                {renderTabs()}
            </Tabs>

            <Divider
                sx={{ mb: '10px' }}
            />

            {tabIndex === 0 &&
                <Consumed
                    projectInfo={projectInfo}
                />
            }

            {tabIndex === 1 &&
                <PurchaseOrder
                    projectInfo={projectInfo}
                />
            }

            {tabIndex === 2 &&
                <Logs
                    projectInfo={projectInfo}
                />
            }
        </>
    )
}


export default Materials;
