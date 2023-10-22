import React from 'react';
import { api } from 'app/services/api'
import Helpers from 'app/utils/Helpers';
import { useSnackbar } from 'notistack'
import { setStaffLists } from 'app/redux/actions/staffsAction';
import { useDispatch } from 'react-redux';

const Logic = (props) => {
    const _helpers = Helpers();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar()


    const _getLists = async (postData) => {
        const bodyData = JSON.stringify(postData)
        const response = await api.post('employees/getEmployees', bodyData);
        let data = await response.json();
        if (response.status === 200) {
            let _decodeData = await _helpers._return(data);
            dispatch(setStaffLists(_decodeData.apiRet));
        } else {
            enqueueSnackbar(`Error retrieving of staff!`, { variant: 'error' });
            return;
        }
    }

    return {
        getLists: (postData) => {
            _getLists(postData);
        },
        addNew: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('employees/create', body);
            let data = await response.json();
            if (response.status === 200) {
                enqueueSnackbar(`Successfully added staff!`, { variant: 'success' });
                _getLists({ status: "All" });
                return _helpers._return(data);
            } else {
                enqueueSnackbar(`Error adding of staff!`, { variant: 'error' });
                return;
            }
        },
        updateStatus: async ({ status, count }) => {
            const body = JSON.stringify({ count: count, status: status });
            const response = await api.post('employees/updateStatus', body);
            if (response.status === 200) {
                let data = await response.json();
                let _data = await _helpers._return(data);
                if (_data.status) {
                    enqueueSnackbar(`Staff marked as ${status}!`, { variant: 'success' });
                    return true;
                } else {
                    enqueueSnackbar(`Error updating of status!`, { variant: 'error' });
                    return false;
                }
            } else {
                enqueueSnackbar(`Error: 401!`, { variant: 'error' });
                return 401;
            }
        }
    }
};


export default Logic;