
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    TextField,
    Button,
} from '@mui/material';
import { Box, styled, useTheme } from '@mui/system'
import { useSnackbar } from 'notistack'

const ContentBox = styled(Box)(({ theme }) => ({
    padding: '0px 5px !important',
    paddingTop: '5px !important',
    [theme.breakpoints.down('sm')]: {
        padding: '0px 12px !important',
    },
}))


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))


export default function AddTicketWindow({
    handleClose,
    data,
    mpSdk,
    tickets,
    setTickets,
}) {

    const [open, setOpen] = React.useState(true);
    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const sid = data?.sid;
    const title = data?.label;
    const refId = data?.refId;
    const desc = data?.description;

    const [state, setState] = useState({
        summary: title,
        description: desc
    })

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const handleSave = () => {
        if (summary === "" || description === "" || summary === undefined || description === undefined) {
            enqueueSnackbar(`Please fill out empty fileds!`, { variant: 'error' });
            return;
        }

        let updateLabelDesc = tickets.map(val => {
            if (val.refId == refId) {
                return {
                    ...val,
                    description: description,
                    label: summary
                }
            } else {
                return val;
            }
        });

        mpSdk.Mattertag.editBillboard(sid, {
            label: summary,
            description: description
        })
            .catch((e) => { console.error(e); });

        setTickets(updateLabelDesc)
        enqueueSnackbar(`Updates saved in browser session.`, { variant: 'success' });
        handleClose()
        setOpen(false);
    }


    const { palette } = useTheme()
    const textMuted = palette.text.secondary

    const { summary, description } = state

    const closeDialog = () => {
        let filterArray = tickets.filter(val => val.refId !== refId);
        setTickets(filterArray);
        mpSdk.Mattertag.remove(sid)
            .catch((e) => { console.log(e); });

        handleClose()
        setOpen(false);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
        >
            <DialogContent dividers>
                <ContentBox>
                    <FlexBox flexGrow={1}>
                        <TextField
                            sx={{ color: textMuted }}
                            onChange={handleChange}
                            name="summary"
                            value={summary || ""}
                            variant="outlined"
                            fullWidth
                            placeholder='Add Title'
                        />
                    </FlexBox>
                    <Box py={1} />
                    <FlexBox flexGrow={1}>
                        <TextField
                            sx={{ color: textMuted }}
                            onChange={handleChange}
                            name="description"
                            value={description || ""}
                            variant="outlined"
                            fullWidth
                            multiline
                            placeholder='Add Decription'
                        />
                    </FlexBox>
                </ContentBox>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={closeDialog}>
                    Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
