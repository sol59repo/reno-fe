import React from 'react';
import { api } from 'app/services/api'
import Helpers from 'app/utils/Helpers';
import { useSnackbar } from 'notistack'

const CalendarLogic = (props) => {
    const _helpers = Helpers();
    const { enqueueSnackbar } = useSnackbar()

    return {
        getManagers: async () => {
            const response = await api.get('meeting/getManagers');
            let data = await response.json();
            if (response.status === 200) {
                let _decodeData = await _helpers._return(data);
                return _decodeData.apiRet;
            } else {
                enqueueSnackbar(`Error retrieving of staff!`, { variant: 'error' });
                return;
            }
        },
        getZoomLink: async (count) => {
            const response = await api.get(`meeting/getZoomLink/${count}`);
            let data = await response.json();
            if (response.status === 200) {
                let _decodeData = await _helpers._return(data);
                return _decodeData.apiRet;
            } else {
                enqueueSnackbar(`Error retrieving of staff!`, { variant: 'error' });
                return;
            }
        },
        getMeetings: async (count) => {
            const response = await api.get(`meeting/getMeetings/${count}`);
            let data = await response.json();
            if (response.status === 200) {
                let _decodeData = await _helpers._return(data);
                return _decodeData.apiRet;
            } else {
                enqueueSnackbar(`Error retrieving of staff!`, { variant: 'error' });
                return;
            }
        },
        getMeetingAttendee: async (count) => {
            const response = await api.get(`meeting/getMeetingAttendee/${count}`);
            let data = await response.json();
            if (response.status === 200) {
                let _decodeData = await _helpers._return(data);
                return _decodeData.apiRet;
            } else {
                enqueueSnackbar(`Error retrieving of staff!`, { variant: 'error' });
                return;
            }
        },
        createCalendarMeeting: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('meeting/createCalendarMeeting', body);
            let data = await response.json();
            if (response.status === 200) {
                enqueueSnackbar(`Successfully added a new schedule`, { variant: 'success' });
                return _helpers._return(data);
            } else {
                enqueueSnackbar(`Error adding of schedule!`, { variant: 'error' });
                return;
            }
        },
        addParticipants: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('meeting/addParticipants', body);
            let data = await response.json();
            if (response.status === 200) {
                enqueueSnackbar(`Successfully added participants!`, { variant: 'success' });
                return _helpers._return(data);
            } else {
                enqueueSnackbar(`Error adding of metting!`, { variant: 'error' });
                return;
            }
        },
        removeAttendee: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('meeting/removeAttendee', body);
            if (response.status === 200) {
                let data = await response.json();
                let _data = await _helpers._return(data);
                if (_data.status) {
                    enqueueSnackbar(`Participant was removed!`, { variant: 'success' });
                    return true;
                } else {
                    enqueueSnackbar(`Error updating of status!`, { variant: 'error' });
                    return false;
                }
            } else {
                enqueueSnackbar(`Error: 401!`, { variant: 'error' });
                return 401;
            }
        },
        removeMeeting: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('meeting/removeMeeting', body);
            if (response.status === 200) {
                let data = await response.json();
                let _data = await _helpers._return(data);
                if (_data.status) {
                    enqueueSnackbar(`Meeting was removed!`, { variant: 'success' });
                    return true;
                } else {
                    enqueueSnackbar(`Error updating of status!`, { variant: 'error' });
                    return false;
                }
            } else {
                enqueueSnackbar(`Error: 401!`, { variant: 'error' });
                return 401;
            }
        },
    }
};


export default CalendarLogic;