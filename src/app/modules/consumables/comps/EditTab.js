import React, { useState, useEffect } from 'react';
import { Dialog, Button, Icon, Grid } from '@mui/material';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Box, styled, useTheme } from '@mui/system'
import { TextField } from 'app/commons/StyledEl';
import { H5, Paragraph, Span } from 'app/components/Typography';
import { SimpleCard } from 'app/components';

const EditTab = (props) => {
    const { _submitChanges, Info, _filterImtem, setInfo } = props

    const [state, setState] = useState({
        itemName: Info.itemName,
        qty: Info.qty
    })


    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }


    const submit = async (event) => {
        event.preventDefault();

        const data = {
            itemName: itemName,
            qty: qty,
            count: Info.count
        }

        const response = await _submitChanges(data);
        if (response) {
            _filterImtem();

            setInfo({
                ...Info,
                itemName: itemName,
                qty: qty,
            })
        }

    }

    const {
        itemName,
        qty
    } = state;

    return (
        <SimpleCard title={"Edit Item Details"}>
            <Box p={3}>
                <ValidatorForm onSubmit={submit} onError={() => null} >
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
                                label="Qty"
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
                                label="Item Name"
                                errorMessages={['this field is required']}
                            />

                        </Grid>
                    </Grid>

                    <Button color="success" variant="contained" type="submit">
                        <Icon>edit</Icon>
                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                            Submit Changes
                        </Span>
                    </Button>
                </ValidatorForm>
            </Box>
        </SimpleCard>

    );
};


export default EditTab;