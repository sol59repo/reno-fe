import React, { useState, useEffect } from 'react'
import { Box, styled, useTheme } from '@mui/system'
import {
    Dialog,
    Button,
    Icon,
    Grid
} from '@mui/material'
import { ValidatorForm, } from 'react-material-ui-form-validator'

import { TextField } from "../../../commons/StyledEl"
import Helpers from "../../../utils/Helpers"
import { useSelector } from 'react-redux'
import { Span } from 'app/components/Typography'
import ProjectLogic from '../logic/ProjectLogic'
import { useDispatch } from 'react-redux'
import { SimpleCard } from 'app/components'


const ProjectComposeDialog = ({ open, handleClose, projectList }) => {
    const dispatch = useDispatch();
    const _helpers = Helpers();
    const _logic = ProjectLogic();
    const [models, setModels] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const [state, setState] = useState({
        Name: "",
        Location: ""
    })


    const { user } = useSelector(state => state.usercontext);


    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            addedBy: user.count,
            Name: Name,
            Location: Location,
        }
        const response = await _logic.addProject(data);
    }

    const {
        Location,
        Name
    } = state


    return (
        <>
            <Dialog
                open={open}
                maxWidth="md"
                fullWidth={true}
                onClose={handleClose}
            >
                <SimpleCard title={"Add Project form"}>
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null} >
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="Name"
                                    onChange={handleChange}
                                    value={Name || ''}
                                    validators={[
                                        'required'
                                    ]}
                                    label="Name"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="Location"
                                    onChange={handleChange}
                                    value={Location || ''}
                                    validators={[
                                        'required'
                                    ]}
                                    label="Location"
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
                </SimpleCard>
            </Dialog>
        </>
    )
}

export default ProjectComposeDialog
