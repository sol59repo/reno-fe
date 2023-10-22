import React from 'react';
import { api } from 'app/services/api'
import Helpers from 'app/utils/Helpers';
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux';



const ProfileLogic = (props) => {
    const _helpers = Helpers();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar()


    return {
        getEmployee: async (id) => {
            const response = await api.get(`employees/getEmployee/${id}`);
            let data = await response.json();
            if (response.status === 200) {
                let _decodeData = await _helpers._return(data);
                return _decodeData.apiRet;
            } else {
                enqueueSnackbar(`Error retrieving of Measurements!`, { variant: 'error' });
                return;
            }
        },
        updateInfo: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('employees/updateInfo', body);
            let data = await response.json();
            if (response.status === 200) {
                enqueueSnackbar(`Successfully Updated employee info!`, { variant: 'success' });
                return _helpers._return(data);
            } else {
                enqueueSnackbar(`Error adding of Material!`, { variant: 'error' });
                return;
            }
        },
        isInArray: (projects, obj) => {
            var i;
            for (i = 0; i < projects.length; i++) {
                if (projects[i].modelId === obj.id) {
                    return true;
                }
            }
            return false;
        },
        uploadProfile: async (postData) => {
            const response = await api.upload('upload/uploadProfile', postData);
            let data = await response.json();
            if (response.status === 200) {
                enqueueSnackbar(`Successfully upploaded file!`, { variant: 'success' });
                return _helpers._return(data);
            } else {
                enqueueSnackbar(`Error adding of PO!`, { variant: 'error' });
                return;
            }
        },
    }
};


export default ProfileLogic;