import React from 'react';
import { api } from 'app/services/api'
import Helpers from 'app/utils/Helpers';
import { useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'

const CommonLogic = (props) => {
    const _helpers = Helpers();
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const {
        role,
        ID,
        count,
        firstname,
        lastname,
        status,
        token,
        usertype
    } = useSelector(state => state.usercontext.user)

    return {
        getRole: () => {
            return role;
        },
        getId: () => {
            return ID;
        },
        getName: () => {
            return firstname + ' ' + lastname;
        },
        getCount: () => {
            return count;
        },
        getStatus: () => {
            return status;
        },
        getUsertype: () => {
            return usertype;
        },
        getToken: () => {
            return token;
        },
        isInArray: (zone, apmObj) => {
            var i;
            for (i = 0; i < zone.length; i++) {
                if (zone[i].value === apmObj.id) {
                    return true;
                }
            }
            return false;
        },
        getUrlPath: () => {
            return pathname.split("/");
        },
        navigateTo: (path) => {
            navigate(path)
        }
    }
};


export default CommonLogic;