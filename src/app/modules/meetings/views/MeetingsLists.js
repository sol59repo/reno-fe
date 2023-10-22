import React, { useState, useEffect } from 'react';

import {
    MatxSidenavContainer,
    MatxSidenav,
    MatxSidenavContent,
    Breadcrumb,
    AlertConfirm,
    Dialogs
} from 'app/components'
import { Box } from '@mui/system'
import { useSnackbar } from 'notistack'
import { Container } from "../../../commons/StyledEl"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MeetingSidenav from '../comps/MeetingSidenav'
import MeetingTopBar from '../comps/MeetingTopBar'
import Meetings from '../comps/Meetings';
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { inboxDB } from '../sampleDB';
import MeetingLogic from '../logic/MeetingLogic'
import { setMeetingLists } from 'app/redux/actions/meetingsAction';

const MeetingsLists = (props) => {
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [masterCheckbox, setMasterCheckbox] = useState(false)
    const [open, setOpen] = useState(false)
    const [isAlive, setIsAlive] = useState(true)
    const dispatch = useDispatch();
    const { meetingList } = useSelector(state => state.meetings);
    const _logic = MeetingLogic();

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))



    useEffect(() => {
        _getlists();
    }, []);


    const _getlists = (status = "All") => {
        const body = {
            status: status
        }
        _logic.getLists(body);
    }

    const _setSelectedStatus = (status) => {
        setSelectedStatus(status);
        _getlists(status)
    }

    const toggleSidenav = () => {
        setOpen(!open)
    }

    const handleMasterCheckbox = (event) => {
        let temp = meetingList
        let isChecked = event.target.checked
        if (isChecked) {
            temp.map((message) => {
                message.selected = true
                return message
            })
        } else {
            temp.map((message) => {
                message.selected = false
                return message
            })
        }
        dispatch(setMeetingLists(temp))
        setMasterCheckbox(isChecked)
    }
    const handleCheckboxSelection = (event, index) => {
        event.persist()
        let temp = meetingList
        temp[index].selected = event.target.checked
        dispatch(setMeetingLists([...temp]))
    }


    useEffect(() => {
        if (isMobile) setOpen(false)
    }, [isMobile])

    useEffect(() => {
        // if (isAlive) dispatch(setMeetingLists(messages))
    }, [isAlive])

    useEffect(() => {
        return () => setIsAlive(false)
    }, [])


    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Meetings', path: '/meetings/list' },

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
                        <MeetingSidenav
                            _setSelectedStatus={_setSelectedStatus} />
                    </MatxSidenav>
                    <MatxSidenavContent>
                        <MeetingTopBar
                            masterCheckbox={masterCheckbox}
                            handleMasterCheckbox={handleMasterCheckbox}
                            toggleSidenav={toggleSidenav}
                        />
                        <Meetings
                            handleCheckboxSelection={handleCheckboxSelection}
                            meetingList={meetingList}
                            selectedStatus={selectedStatus}
                        />

                    </MatxSidenavContent>
                </MatxSidenavContainer>
            </Box>
        </Container >
    );
}


export default MeetingsLists;