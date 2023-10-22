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
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material'
import TablePurchaseOrder from '../comps/TablePurchaseOrder';
import PurchaseOrderTopBar from '../comps/PurchaseOrderTopBar';
import PurchaseOrderSideNav from '../comps/PurchaseOrderSideNav';
import ConsumablesLogic from '../logic/ConsumablesLogic';
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic';
import { AlertConfirm, Dialogs } from "../../../commons"
import { useTheme } from '@mui/system'
import InfoDialog from '../comps/InfoDialog';
import {
    useNavigate,
    useParams
} from 'react-router-dom';
import CommonLogic from 'app/logic/CommonLogic';



const PurchaseOrder = (props) => {
    const navigate = useNavigate();
    const _commonLogic = CommonLogic();
    const _projectLogic = ProjectLogic();
    const _itemLogic = ConsumablesLogic();
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [open, setOpen] = useState(false);
    const [purchasedOrderLists, setPurchasedOrderLists] = useState([]);

    const [openInfo, setOpenInfo] = useState(false);
    const [Info, setInfo] = useState({});
    const path = _commonLogic.getUrlPath();
    const pageType = path[2];

    useEffect(() => {
        getAllPO()
    }, []);


    const getAllPO = async () => {
        const data = {
            status: selectedStatus
        }
        const response = await _itemLogic.getAllPO(data);
        setPurchasedOrderLists(response)
    }


    const _setSelectedStatus = (status) => {
        setSelectedStatus(status);
        _filterImtem(status)
    }

    const _filterImtem = async (status) => {
        const data = {
            status: status
        }
        const response = await _itemLogic.getAllPO(data);
        setPurchasedOrderLists(response)
    }


    const toggleSidenav = () => {
        setOpen(!open)
    }

    const _handleStatus = (count, status, modelId) => () => {
        AlertConfirm({
            callback: () => _confirmStatus(count, status, modelId),
            title: `Mark order as ${status}?`,
            text: "Please confirm",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmStatus = async (count, status, modelId) => {
        const response = await _itemLogic.updatePoStatus({ status: status, count: count, modelId: modelId });
        if (response) {
            _filterImtem(selectedStatus)
        }
    }

    const _handleDecline = (count, status, modelId) => () => {
        AlertConfirm({
            callback: () => _confirmDecline(count, status, modelId),
            title: `Decline Order?`,
            text: "You wont be able to revert this .Please confirm!",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }


    const _confirmDecline = async (count, status, modelId) => {
        const responseItems = await _projectLogic.getPoDetails(count);
        const response = await _itemLogic.declinePo({
            status: status,
            count: count,
            Items: responseItems,
            modelId: modelId
        });
        if (response) {
            _filterImtem(selectedStatus)
        }
    }


    useEffect(() => {
        if (isMobile) setOpen(false)
    }, [isMobile])


    const handleClose = () => {
        setOpenInfo(false)
    }

    const viewInfo = (data) => {
        setInfo(data);
        setOpenInfo(true)
    }

    return (
        <Box mx="4px" mb="4px">
            <MatxSidenavContainer>
                <MatxSidenav
                    width="220px"
                    toggleSidenav={toggleSidenav}
                    open={open}
                    pageType={pageType}
                >
                    <PurchaseOrderSideNav
                        _setSelectedStatus={_setSelectedStatus}
                    />

                </MatxSidenav>
                <MatxSidenavContent>
                    <PurchaseOrderTopBar
                        toggleSidenav={toggleSidenav}
                    />
                    <Box width="100%" overflow="auto">
                        <TablePurchaseOrder
                            purchasedOrderLists={purchasedOrderLists}
                            _handleStatus={_handleStatus}
                            _handleDecline={_handleDecline}
                            viewInfo={viewInfo}
                        />
                    </Box>

                </MatxSidenavContent>
            </MatxSidenavContainer>
        </Box>
    );
};



export default PurchaseOrder;




