
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


export default function AddLabelWindow({
    handleClose,
    data,
    mpSdk,
    measurements,
    setMeasurements,
}) {

    const [open, setOpen] = React.useState(true);
    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const sid = data?.sid;
    const title = data?.label;
    const refId = data?.refId;
    const measurementID = data?.measurementID;

    const [state, setState] = useState({
        summary: title,
    })

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const handleSave = () => {
        if (summary === "" || summary === undefined) {
            enqueueSnackbar(`Please fill out empty fileds!`, { variant: 'error' });
            return;
        }

        let updateLabelDesc = measurements.map(val => {
            if (val.measurementID == measurementID) {
                return {
                    ...val,
                    label: summary
                }
            } else {
                return val;
            }
        });

        mpSdk.Mattertag.editBillboard(sid, {
            label: summary,
        })
            .catch((e) => { console.error(e); });

        setMeasurements(updateLabelDesc)
        enqueueSnackbar(`Updates saved in browser session.`, { variant: 'success' });
        handleClose()
        setOpen(false);
    }


    const { palette } = useTheme()
    const textMuted = palette.text.secondary

    const { summary } = state

    const closeDialog = () => {
        let toRemove = measurements.filter(val => val.measurementID === measurementID);
        let filterArray = measurements.filter(val => val.measurementID !== measurementID);
        setMeasurements(filterArray);

        let pushtoRemove = [];
        toRemove.forEach(element => {
            pushtoRemove.push(element.sid);
        });
        mpSdk.Mattertag.remove(pushtoRemove);
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
