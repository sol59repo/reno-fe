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
import TableConsumables from '../comps/TableConsumables';
import ConsumablesTopBar from '../comps/ConsumablesTopBar';
import ConsumablesSidenav from '../comps/ConsumablesSidenav';
import ConsumablesLogic from '../logic/ConsumablesLogic';
import { AlertConfirm, Dialogs } from "../../../commons"
import { useTheme } from '@mui/system'
import InfoDialog from '../comps/InfoDialog';


const ConsumablesList = (props) => {
    const _itemLogic = ConsumablesLogic();
    const theme = useTheme()
    const { consumablesLists } = useSelector(state => state.consumables);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [open, setOpen] = useState(false);

    const [openInfo, setOpenInfo] = useState(false);
    const [Info, setInfo] = useState({});

    useEffect(() => {
        _itemLogic.getLists({ status: selectedStatus });
    }, []);


    const _setSelectedStatus = (status) => {
        setSelectedStatus(status);
        _filterImtem(status)
    }

    const _filterImtem = (status) => {
        _itemLogic.getLists({ status: status });
    }


    const toggleSidenav = () => {
        setOpen(!open)
    }

    const handleSubmit = async (data) => {
        console.log(data);
        const response = await _itemLogic.addNew(data);

        if (response) {
            return true;
        }

        return false;
    }

    const _handleDelete = (tableMeta) => () => {
        const itemCode = tableMeta.rowData[0]
        AlertConfirm({
            callback: () => _confirmDelete(itemCode),
            title: 'Remove Item?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmDelete = async (itemCode) => {
        const response = await _itemLogic.updateStatus({ status: "Deleted", itemCode: itemCode });
        if (response) {
            _itemLogic.getLists({ status: selectedStatus });
        }
    }

    const _handleStatus = (tableMeta, status) => () => {
        const itemCode = tableMeta.rowData[0]
        AlertConfirm({
            callback: () => _confirmStatus(itemCode, status),
            title: `Mark Item as ${status}?`,
            text: "Please confirm",
            icon: 'info',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmStatus = async (itemCode, status) => {
        const response = await _itemLogic.updateStatus({ status: status, itemCode: itemCode });
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

    const _submitChanges = async (data) => {
        const body = JSON.stringify(data);
        const response = await _itemLogic.updateInfo(body);
        if (response) {
            return true;
        }

        return false;
    }

    return (
        <>
            <Box mx="4px" mb="4px">
                <MatxSidenavContainer>
                    <MatxSidenav
                        width="220px"
                        toggleSidenav={toggleSidenav}
                        open={open}
                    >
                        <ConsumablesSidenav
                            handleSubmit={handleSubmit}
                            _setSelectedStatus={_setSelectedStatus}
                        />

                    </MatxSidenav>
                    <MatxSidenavContent>
                        <ConsumablesTopBar
                            toggleSidenav={toggleSidenav}
                        />

                        <Box width="100%" overflow="auto">
                            <TableConsumables
                                consumablesLists={consumablesLists}
                                _handleDelete={_handleDelete}
                                _handleStatus={_handleStatus}
                                viewInfo={viewInfo}
                            />
                        </Box>

                    </MatxSidenavContent>
                </MatxSidenavContainer>
            </Box>

            <InfoDialog
                handleClose={handleClose}
                open={openInfo}
                Info={Info}
                _submitChanges={_submitChanges}
                _filterImtem={() => _filterImtem(selectedStatus)}
                setInfo={setInfo}
            />
        </>
    );
};



export default ConsumablesList;