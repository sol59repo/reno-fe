import React from 'react';
import { api } from 'app/services/api'
import Helpers from 'app/utils/Helpers';
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux';
import { setConsumablesLists } from 'app/redux/actions/consumableAction';
import CommonLogic from 'app/logic/CommonLogic';

const ConsumablesLogic = (props) => {
    const _helpers = Helpers();
    const dispatch = useDispatch();
    const _commonLogic = CommonLogic();
    const { enqueueSnackbar } = useSnackbar()


    const _getLists = async (postData) => {
        const bodyData = JSON.stringify(postData)
        const response = await api.post('consumables/getConsumables', bodyData);
        let data = await response.json();
        if (response.status === 200) {
            let _decodeData = await _helpers._return(data);

            console.log('_decodeData.apiRet', _decodeData.apiRet);
            dispatch(setConsumablesLists(_decodeData.apiRet));
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
            const response = await api.post('consumables/createItems', body);
            let data = await response.json();
            if (response.status === 200) {
                enqueueSnackbar(`Successfully added item!`, { variant: 'success' });
                _getLists({ status: "All" });
                return _helpers._return(data);
            } else {
                enqueueSnackbar(`Error adding of item!`, { variant: 'error' });
                return;
            }
        },
        updateStatus: async ({ status, itemCode }) => {
            const body = JSON.stringify({ itemCode: itemCode, status: status });
            const response = await api.post('consumables/updateStatus', body);
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
        },
        updatePoStatus: async ({ status, count, modelId }) => {
            const body = JSON.stringify({
                count: count,
                status: status,
                modelId: modelId,
                addedBy: _commonLogic.getCount()
            });
            const response = await api.post('consumables/updatePoStatus', body);
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
        },
        declinePo: async ({ status, count, Items, modelId }) => {
            const body = JSON.stringify({
                count: count,
                status: status,
                Items: Items,
                modelId: modelId,
                addedBy: _commonLogic.getCount()
            });
            const response = await api.post('consumables/declinePo', body);
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
        },
        updateInfo: async (postData) => {
            const response = await api.post('consumables/updateInfo', postData);
            if (response.status === 200) {
                let data = await response.json();
                let _data = await _helpers._return(data);
                if (_data.status) {
                    enqueueSnackbar(`Update success!`, { variant: 'success' });
                    return true;
                } else {
                    enqueueSnackbar(`Error updating of info!`, { variant: 'error' });
                    return false;
                }
            } else {
                enqueueSnackbar(`Error: 401!`, { variant: 'error' });
                return 401;
            }
        },
        getAllPO: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('consumables/getAllPO', body);
            let data = await response.json();
            if (response.status === 200) {
                let _decodeData = await _helpers._return(data);
                return _decodeData.apiRet;
            } else {
                enqueueSnackbar(`Error retrieving of Projects!`, { variant: 'error' });
                return;
            }
        },
        initItems: async (postData) => {
            const body = JSON.stringify(postData);
            const response = await api.post('consumables/initItems', body);
            let data = await response.json();
            if (response.status === 200) {
                enqueueSnackbar(`Successfully added item!`, { variant: 'success' });
                _getLists({ status: "All" });
                return _helpers._return(data);
            } else {
                enqueueSnackbar(`Error adding of item!`, { variant: 'error' });
                return;
            }
        },
    }
};


export default ConsumablesLogic;