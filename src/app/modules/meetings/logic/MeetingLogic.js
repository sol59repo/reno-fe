import React from 'react';
import { api } from 'app/services/api'
import Helpers from 'app/utils/Helpers';
import { useSnackbar } from 'notistack'
import { setMeetingLists } from 'app/redux/actions/meetingsAction';
import { useDispatch } from 'react-redux';


const MeetingLogic = (props) => {
    const _helpers = Helpers();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar()


    const _getLists = async (postData) => {
        const body = JSON.stringify(postData);
        const response = await api.post('meeting/getMeetings', body);
        let data = await response.json();
        if (response.status === 200) {
            let _decodeData = await _helpers._return(data);
            dispatch(setMeetingLists(_decodeData.apiRet));
        } else {
            enqueueSnackbar(`Error retrieving of meetings!`, { variant: 'error' });
            return;
        }
    }

    const _getMeeting = async (postData) => {
        const body = JSON.stringify(postData);
        const response = await api.post('meeting/getMeeting', body);
        let data = await response.json();
        if (response.status === 200) {
            let _decodeData = await _helpers._return(data);
            return _decodeData.apiRet;
        } else {
            enqueueSnackbar(`Error retrieving of meetings!`, { variant: 'error' });
            return;
        }

    }
    const _getAttendees = async (id) => {
        const response = await api.get(`meeting/getAttendees/${id}`);
        let data = await response.json();
        if (response.status === 200) {
            let _decodeData = await _helpers._return(data);
            return _decodeData.apiRet;
        } else {
            enqueueSnackbar(`Error retrieving of attendees!`, { variant: 'error' });
            return;
        }
    }

    return {
        getLists: (postData) => {
            _getLists(postData);
        },
        getMeeting: (postData) => {
            return _getMeeting(postData);
        },
        addNew: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('meeting/createMeeting', body);
            let data = await response.json();
            if (response.status === 200) {
                enqueueSnackbar(`Successfully added meeting schedule!`, { variant: 'success' });
                _getLists({ status: "" });
                return _helpers._return(data);
            } else {
                enqueueSnackbar(`Error adding of metting!`, { variant: 'error' });
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
        updateStatus: async ({ status, meetingId }) => {
            const body = JSON.stringify({ meetingId: meetingId, status: status });
            const response = await api.post('meeting/updateStatus', body);
            if (response.status === 200) {
                let data = await response.json();
                let _data = await _helpers._return(data);
                if (_data.status) {
                    enqueueSnackbar(`Meeting marked as ${status}!`, { variant: 'success' });
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
        getAttendees: async (id) => {
            return _getAttendees(id)
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
        isInArray: (attendees, obj) => {
            var i;
            for (i = 0; i < attendees.length; i++) {
                if (attendees[i].UserId === obj.count) {
                    return true;
                }
            }
            return false;
        },
        generateMeetingSig: async (postData) => {
            const response = await api.post('meeting/generateMeetingSig', postData);
            if (response.status === 200) {
                let data = await response.json();
                let _data = await _helpers._return(data);
                if (_data.status) {
                    return _data.apiRet;
                } else {
                    enqueueSnackbar(`Error creating of signature!`, { variant: 'error' });
                    return false;
                }
            } else {
                enqueueSnackbar(`Error: 401!`, { variant: 'error' });
                return false;
            }
        }

    }
};


export default MeetingLogic;