import React, { useState, useEffect } from 'react'
import { useTheme, Box } from '@mui/system'
import {
    Dialog,
    IconButton,
} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import TableTicket from './TableTicket'
import AddNew from './AddNew'
import ProjectLogic from '../logic/ProjectLogic'
import CommonLogic from 'app/logic/CommonLogic'
import Board from './Board'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const TicketDialog = (props) => {
    const theme = useTheme()
    const _logic = ProjectLogic();
    const _commonlogic = CommonLogic();
    const path = _commonlogic.getUrlPath();
    const modelId = path[2];

    const [openAdd, setOpenAddNew] = useState(false)
    const [tickets, setTickets] = useState([])

    const {
        setOpenTicketDialog,
        open,
        LocationName
    } = props


    useEffect(() => {
        getTickets();
    }, []);

    const getTickets = async () => {
        const response = await _logic.getTickets(modelId);
        setTickets(response);
    }

    return (
        <Dialog
            open={open}
            fullScreen
            fullWidth={true}
            onClose={() => setOpenTicketDialog(false)}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setOpenTicketDialog(false)}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div
                style={{
                    // backgroundImage: `url(${"/assets/bg/bg.webp"})`,
                    background: '#e9e9e9',
                    height: '100%',
                }}
            >
                <Board LocationName={LocationName} />
            </div>
        </Dialog>
    );
};


export default TicketDialog;