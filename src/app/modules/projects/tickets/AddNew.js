import React, { useState, useEffect } from 'react'
import { Box, styled, } from '@mui/system'
import { Button, Icon, Select, Grid, MenuItem, InputLabel, FormControl, Divider } from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { TextField, } from "../../../commons/StyledEl"
import { Span } from 'app/components/Typography'
import { useTheme } from '@mui/system'
import { Dialog } from '@mui/material'
import { SimpleCard } from 'app/components'
import ProjectLogic from '../logic/ProjectLogic'
import CommonLogic from 'app/logic/CommonLogic'


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

const InputField = styled(TextField)(() => ({
    marginBottom: '16px',
}))



const AddNew = (props) => {
    const theme = useTheme();
    const _logic = ProjectLogic();
    const _commonlogic = CommonLogic();
    const path = _commonlogic.getUrlPath();
    const modelId = path[2];


    const [state, setState] = useState({
        category: ""
    });
    const { setOpenAddNew, open, getTickets } = props
    const { name, description } = state

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            name: name,
            modelId: modelId,
            description: description,

        }

        const response = await _logic.addTicket(data);

        if (response.status) {
            getTickets()
        }

    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    }

    const handleCategory = (event) => {
        setState({
            ...state,
            category: event.target.value
        });
    }

    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth={true}
            onClose={() => setOpenAddNew(false)}
        >
            <SimpleCard title={"New Ticket"}>
                <ValidatorForm
                    onSubmit={handleSubmit}
                    onError={(errors) => null}
                >
                    <Grid container spacing={6}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                type="text"
                                name="name"
                                onChange={handleChange}
                                value={name || ''}
                                validators={[
                                    'required'
                                ]}
                                label="Ticket Name"
                                errorMessages={['this field is required']}
                            />
                            <InputField
                                label="Enter description/instruction for this ticket"
                                variant="outlined"
                                size="small"
                                fullWidth
                                multiline
                                rows={6}
                                name="description"
                                value={description || ""}
                                onChange={handleChange}
                                validators={[
                                    'required'
                                ]}
                                errorMessages={['this field is required']}
                            />

                        </Grid>
                    </Grid>
                    <Box py={1} />
                    <FormController>
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
            </SimpleCard>
        </Dialog>
    );
};
export default AddNew;