import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables"
import { Icon, IconButton, Menu, MenuItem, Tooltip, Fab, Grid } from '@mui/material'
import { Small } from "../../../commons/StyledEl"

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import Helpers from "../../../utils/Helpers"
import MeetingLogic from '../logic/MeetingLogic';
import { AlertConfirm } from 'app/commons';


const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});


const Attendees = (props) => {
    const { staffLists, selectedRow } = props
    const { ID: meetingId } = selectedRow

    const [attendees, setAttendees] = useState([])
    const _helpers = Helpers();
    const _logic = MeetingLogic();


    useEffect(() => {
        _getAttedees();
    }, [])

    const _getAttedees = async () => {
        console.log('meetingId', meetingId);

        const response = await _logic.getAttendees(meetingId);
        console.log('response', response);
        setAttendees(response);
    }

    const _addParticipants = async (ID) => {
        console.log('ID', ID);
        console.log('meetingId', meetingId);

        const body = {
            fkMeetingCount: meetingId,
            fkUserCount: ID,
            attendStatus: "Incoming"
        }

        const response = await _logic.addParticipants(body);
        if (response.status) {
            _getAttedees();
        }
    }

    const _handleDelete = (count) => {
        AlertConfirm({
            callback: () => _confirmDelete(count),
            title: 'Remove Attendee?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmDelete = async (count) => {
        const response = await _logic.removeAttendee({ count: count });
        console.log('_confirmDelete', response);
        if (response) {
            _getAttedees();
        }
    }


    console.log(staffLists);


    const filteredStaff = staffLists.filter((val) => {
        if (_logic.isInArray(attendees, val))
            return false;
        return true;
    });

    console.log('attendees', attendees);

    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <MUIDataTable
                            title={"Participants"}
                            data={attendees}
                            columns={[
                                { name: "ID", label: "USER ID", options: { filter: true, sort: true } },
                                { name: "firstname", label: "Firstname", options: { filter: true, sort: true } },
                                { name: "lastname", label: "Lastname", options: { filter: true, sort: true } },
                                {
                                    name: "attendStatus",
                                    label: "Attend Status",
                                    options: {
                                        customBodyRender: (value, tableMeta, updateValue) => {
                                            return (
                                                <Small bgcolor={_helpers.statusColor(value)}>
                                                    {value}
                                                </Small>
                                            )
                                        }
                                    }
                                },
                                {
                                    name: "count",
                                    label: "Action",
                                    options: {
                                        customBodyRender: (value, tableMeta, updateValue) => {
                                            return (
                                                <IconButton size='small'
                                                    color="primary"
                                                    onClick={() => _handleDelete(value)}
                                                >
                                                    <Icon color="action">delete_forever</Icon>
                                                </IconButton>
                                            )
                                        }
                                    }
                                }
                            ]}

                            options={{
                                search: true,
                                download: false,
                                print: false,
                                viewColumns: false,
                                filter: true,
                                filterType: "dropdown",
                                responsive: "vertical", // standard , simple,vertical,stacked
                                tableBodyHeight: "100%",
                                tableBodyMaxHeight: '350px',
                                selectableRows: false,
                                rowsPerPage: 5,
                                sortOrder: {
                                    name: 'ticket',
                                    direction: 'desc'
                                },
                                onTableChange: (action, state) => {

                                },
                            }}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <MUIDataTable
                            title={"Add Participants from the lists"}
                            data={filteredStaff}
                            columns={[
                                { name: "ID", label: "USER ID", options: { filter: true, sort: true } },
                                { name: "firstname", label: "Firstname", options: { filter: true, sort: true } },
                                { name: "lastname", label: "Lastname", options: { filter: true, sort: true } },
                                {
                                    name: "usertype",
                                    label: "Usertype",
                                    options: {
                                        customBodyRender: (value, tableMeta, updateValue) => {
                                            return (
                                                <Small bgcolor={_helpers.statusColor(value)}>
                                                    {value}
                                                </Small>
                                            )
                                        }
                                    }
                                },
                                {
                                    name: "ID",
                                    label: "Action",
                                    options: {
                                        customBodyRender: (value, tableMeta, updateValue) => {
                                            return (
                                                <IconButton size='small'
                                                    color="primary"
                                                    onClick={() => _addParticipants(value)}
                                                >
                                                    <Icon color="action">check</Icon>
                                                </IconButton>
                                            )
                                        }
                                    }
                                }
                            ]}
                            options={{
                                search: true,
                                download: false,
                                print: false,
                                viewColumns: false,
                                filter: true,
                                filterType: "dropdown",
                                responsive: "vertical", // standard , simple,vertical,stacked
                                tableBodyHeight: "100%",
                                tableBodyMaxHeight: '350px',
                                selectableRows: false,
                                rowsPerPage: 5,
                                sortOrder: {
                                    name: 'ticket',
                                    direction: 'desc'
                                },
                                onTableChange: (action, state) => {

                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </ThemeProvider>
        </CacheProvider>
    );
};


export default Attendees;