import React, { useState, useEffect } from 'react'
import { Box, Button, Icon, Avatar } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTheme } from '@mui/system'
import ProjectLogic from '../../../logic/ProjectLogic'
import Table from './logs/Table'
import CommonLogic from "app/logic/CommonLogic"
import { useParams } from 'react-router-dom'


const Logs = ({ projectInfo }) => {
    const _commonLogic = CommonLogic();
    const { enqueueSnackbar } = useSnackbar()
    const { id } = useParams();
    const theme = useTheme()
    const _logic = ProjectLogic();
    const [logs, setlogs] = useState([])


    useEffect(() => {
        getProjectConsumableLogs()
    }, []);

    const getProjectConsumableLogs = async () => {
        const response = await _logic.getProjectConsumableLogs(id);
        setlogs(response);
    }

    return (
        <Box width="100%" overflow="auto">
            <Table
                logs={logs}
            />
        </Box>
    )
}


export default Logs;
