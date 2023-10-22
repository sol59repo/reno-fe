import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@mui/system'
import jwt_decode from "jwt-decode";

const Helpers = (props) => {
    const { palette } = useTheme()
    const bgPrimary = palette.primary.main
    const bgSecondary = palette.secondary.main
    const bgSuccess = palette.success.light
    const bgWarning = palette.warning.main
    const bgInfo = palette.info.main
    const bgError = palette.error.main
    const bgGrey400 = palette.grey[400]
    const bgGrey100 = palette.grey[600]

    const _decodeData = (data) => {
        const { apimode, ret } = data;
        let retData;
        if (apimode === "LIVE") {
            retData = jwt_decode(ret);
        } else {
            retData = ret;
        }
        return retData;
    }

    return {
        statusRGB: (status) => {
            const colors = {
                Pending: { r: 1, g: 0, b: 0 },
                InProgress: { r: 0.9, g: 0.9, b: 0 },
                Completed: { r: 0.0, g: 0.0, b: 1.0 }
            }
            return colors[status]
        },
        statusRGBTABLE: (status) => {
            const colors = {
                Pending: bgError,
                InProgress: bgSecondary,
                Completed: bgPrimary
            }
            return colors[status]
        },
        statusColor: (status) => {
            const colors = {
                Inprogress: bgPrimary,
                Pending: bgSecondary,
                Completed: bgSuccess,
                Active: bgPrimary,
                Finished: bgSuccess,
                Inprogress: bgWarning,
                Inactive: bgSecondary,
                Archived: bgError,
                Attended: bgSuccess,
                Absent: bgError,
                Incoming: bgInfo,
                Acknowledged: bgInfo,
                Superadmin: bgError,
                Admin: bgGrey400,
                Staff: bgGrey100,
                'Approved': bgSuccess,
                'Present': bgSuccess,
                'For Approval': bgSecondary,
                'Leave': bgSecondary,
                'Open': bgSecondary,
                'Absent': bgError,
                'Declined': bgError,
                'In-Stock': bgSuccess,
                'Near-Deplete': bgPrimary,
                'Out-of-Stock': bgError,
                "": bgGrey400
            }
            return colors[status]
        },
        genrateId: (type) => {
            return type === "time" ? new Date().getTime() : uuidv4();
        },
        generateUserId: () => {
            var date = new Date();
            var year = date.getFullYear().toString().slice(-2);
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            return year + month + "-" + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        },
        _return: async (data) => {
            return {
                status: true,
                msg: ' Success',
                apiRet: await _decodeData(data),
            };
        },
        truncate: (str, n) => {
            return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
        }
    }
};


export default Helpers;


