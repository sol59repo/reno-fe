import React, { useState } from 'react'
import { Box, styled, useTheme } from '@mui/system'
import { Breadcrumb, SimpleCard, MatxProgressBar, RichTextEditor } from 'app/components'
import { Dialog, Button, IconButton, Icon, Fab, Grid, Card, Divider } from '@mui/material'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { TextField, AutoComplete } from "../../../commons/StyledEl"
import Helpers from "../../../utils/Helpers"
import { H5, Paragraph, Span } from 'app/components/Typography'
import { useSelector } from 'react-redux'
import shortid from "shortid"


const FabIcon = styled(Fab)(() => ({
    textTransform: 'capitalize',
    '& .icon': { marginRight: '8px' },
}))

const HiddenInput = styled('input')(() => ({
    display: 'none',
}))

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const FormController = styled('div')(() => ({
    flexWrap: 1,
    display: 'flex',
    marginBottom: '16px',
    justifyContent: 'space-between',
}))


const DragFileBox = styled(FlexBox)(() => ({
    width: '100%',
    height: 100,
    borderRadius: '4px',
    marginBottom: '24px',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const ConsumableComposeDialog = ({ open, handleClose, handleSubmit }) => {
    const _helpers = Helpers();
    const { user } = useSelector(state => state.usercontext)
    const [state, setState] = useState({});

    console.log('user', user);

    const {
        qty,
        itemName
    } = state


    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const _submit = async (event) => {
        event.preventDefault();
        const data = {
            qty: qty,
            itemName: itemName,
            addedBy: user.count,
            itemCode: shortid.generate()
        }
        const response = await handleSubmit(data);
        if (response) {
            setState({})
        }
    }

    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth={true}
            onClose={handleClose}
        >
            <Box p={3}>
                <ValidatorForm onSubmit={_submit} onError={() => null} >
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                type="number"
                                name="qty"
                                onChange={handleChange}
                                value={qty || ''}
                                validators={[
                                    'required'
                                ]}
                                label="qty"
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                            <TextField
                                type="text"
                                name="itemName"
                                onChange={handleChange}
                                value={itemName || ''}
                                validators={[
                                    'required'
                                ]}
                                label="itemName"
                                errorMessages={['this field is required']}
                            />

                        </Grid>
                    </Grid>

                    <Button color="success" variant="contained" type="submit">
                        <Icon>send</Icon>
                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                            Submit
                        </Span>
                    </Button>
                </ValidatorForm>
            </Box>
        </Dialog>
    )
}

export default ConsumableComposeDialog
