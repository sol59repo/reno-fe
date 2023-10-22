import React, { useEffect, useState } from 'react';
import CommonLogic from 'app/logic/CommonLogic';
import ProjectLogic from '../../logic/ProjectLogic';
import { Container } from 'app/commons/StyledEl';
import { SimpleCard } from 'app/components';
import TicketDialog from '../../tickets/TicketDialog';
import { styled } from '@mui/system';
import { Button, SnackbarContent } from '@mui/material';
import Board from '../../tickets/Board';


const SnackbarRoot = styled('div')(({ theme }) => ({
    maxWidth: 600,
    '& .snackbar': {
        margin: theme.spacing(1),
        background: "rgb(255, 61, 87)"
    },
}))


const Ticket = (props) => {
    const _commonLogic = CommonLogic();
    const _logic = ProjectLogic();
    const path = _commonLogic.getUrlPath();
    const modelId = path[2];

    const [openTicketDialog, setOpenTicketDialog] = useState(false)


    const [LocationName, setLocationName] = useState(null);

    useEffect(async () => {
        const response = await _logic.getLocationName(modelId);
        if (response.length > 0) {
            setLocationName(response[0].location)
        }
    }, [])



    const action = (
        <Button
            color="inherit"
            size="small"
            onClick={() => setOpenTicketDialog(true)}
            style={{ backgroundColor: 'rgb(237, 108, 2)' }}
        >
            View Documentation
        </Button>
    )


    return (
        <Board LocationName={LocationName} />
    );
};


export default Ticket;