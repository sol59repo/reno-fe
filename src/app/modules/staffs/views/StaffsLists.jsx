import React, { useState, useEffect } from 'react'
import { Box, Button, Icon } from '@mui/material'
import { useSnackbar } from 'notistack'
import { Container } from "../../../commons/StyledEl"
import { AlertConfirm, Dialogs } from "../../../commons"
import { useNavigate } from 'react-router-dom'
import AddStaffForm from '../comps/AddStaffForm'
import { useDispatch, useSelector } from 'react-redux'
import Logic from '../logic/Logic'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'


import {
    MatxSidenavContainer,
    MatxSidenav,
    MatxSidenavContent,
    Breadcrumb
} from 'app/components'

import StaffSidenav from '../comps/StaffSidenav'
import StaffTopBar from '../comps/StaffTopBar'
import TableStaff from '../comps/TableStaff'



const StaffsLists = () => {
    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const navigate = useNavigate();
    const _logic = Logic();
    const { staffLists } = useSelector(state => state.staffs)

    const [selectedStatus, setSelectedStatus] = useState('All')
    const [open, setOpen] = useState(false)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))


    useEffect(() => {
        _logic.getLists({ status: selectedStatus });
    }, []);

    const toggleSidenav = () => {
        setOpen(!open)
    }

    const _setSelectedStatus = (status) => {
        setSelectedStatus(status);
        _filterTechnician(status)
    }

    const _filterTechnician = (status) => {
        _logic.getLists({ status: status });
    }

    const _submitNewStaff = async (data) => {
        const response = await _logic.addNew(data);
        console.log('response', response);
        if (response.status) {
            _logic.getLists({ status: selectedStatus });
            return true;
        }

        return false;
    }



    const _viewStaff = (ID) => {
        navigate(`/view-employee/${ID}`);
    }

    const _handleDelete = (staff) => () => {
        AlertConfirm({
            callback: () => _confirmDelete(staff),
            title: 'Remove Staff?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmDelete = async (staff) => {
        const response = await _logic.updateStatus({ status: "Deleted", count: staff });
        if (response) {
            _logic.getLists({ status: selectedStatus });
        }
    }

    const _handleStatus = (id, status) => () => {
        console.log(status);


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
        const response = await _logic.updateStatus({ status: status, count: id });
        if (response) {
            _filterTechnician(selectedStatus)
        }
    }


    useEffect(() => {
        if (isMobile) setOpen(false)
    }, [isMobile])


    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Employee', path: '/employee/list' },

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
                        <StaffSidenav
                            _setSelectedStatus={_setSelectedStatus}
                            _submitNewStaff={_submitNewStaff} />
                    </MatxSidenav>
                    <MatxSidenavContent>
                        <StaffTopBar
                            toggleSidenav={toggleSidenav}
                        />
                        <Box width="100%" overflow="auto">
                            <TableStaff
                                _handleDelete={_handleDelete}
                                _handleStatus={_handleStatus}
                                _viewStaff={_viewStaff}
                                staffs={staffLists}
                            />
                        </Box>
                    </MatxSidenavContent>
                </MatxSidenavContainer>
            </Box>
        </Container >
    )
}


export default StaffsLists;
