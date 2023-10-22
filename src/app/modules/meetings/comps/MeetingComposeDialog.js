import React, { useState } from 'react'
import { Box, styled, } from '@mui/system'
import { RichTextEditor } from 'app/components'
import { Dialog, Button, Icon, Fab, Grid, } from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DateTimePicker } from '@mui/lab'
import { TextField, } from "../../../commons/StyledEl"
import { useSelector } from 'react-redux'
import { Span } from 'app/components/Typography'
import MeetingLogic from '../logic/MeetingLogic'

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


const MeetingComposeDialog = ({ open, handleClose }) => {
    const _logic = MeetingLogic();
    const { email, count } = useSelector(state => state.usercontext.user);

    const [state, setState] = useState({
        date: new Date(),
        content: '',
        isPrio: false
    });

    const handleContentChange = (contentHtml) => {
        setState({
            ...state,
            content: contentHtml,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const body = {
            user: email,
            count: count,
            content: content,
            postData: JSON.stringify({
                "agenda": agenda,
                "topic": agenda,
                "type": 2,
                "pre_schedule": true,
                "start_time": date,
                "schedule_for": email,
                settings: {
                    "host_video": "true",
                    "participant_video": "true"
                  }
            })
        }

        const response = await _logic.addNew(body);
        console.log('response', response);
        if (response.status) {
            clear()
        }
    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const clear = () => {
        setState({
            agenda: "",
            date: new Date(),
        })
    }

    const handleDateChange = (date) => {
        setState({ ...state, date })
    }

    const {
        agenda,
        date,
        content,
    } = state


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth={true}
        >
            <Box p={3}>
                <ValidatorForm
                    onSubmit={handleSubmit}
                    onError={(errors) => null}
                >
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                type="text"
                                name="agenda"
                                onChange={handleChange}
                                value={agenda || ''}
                                validators={[
                                    'required'
                                ]}
                                label="Agenda"
                                errorMessages={['this field is required']}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Schedule"
                                    validators={[
                                        'required'
                                    ]}
                                    errorMessages={['this field is required']}
                                    value={date}
                                    onChange={handleDateChange}
                                    renderInput={(props) => (
                                        <TextField {...props} />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <RichTextEditor
                        content={content}
                        handleContentChange={handleContentChange}
                        placeholder="Additional Notes..."
                    />
                    <FormController>
                        <Button onClick={handleClose}>Cancel</Button>
                        <FlexBox>
                            <Button color="success" variant="contained" type="submit">
                                <Icon>send</Icon>
                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                    Submit
                                </Span>
                            </Button>
                        </FlexBox>
                    </FormController>
                </ValidatorForm>
            </Box>
        </Dialog>
    )
}

export default MeetingComposeDialog
