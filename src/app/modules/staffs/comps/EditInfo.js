import {
    Avatar,
    Button,
    Card,
    Divider,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Grid
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { Box, styled, useTheme } from '@mui/system'
import { ValidatorForm } from 'react-material-ui-form-validator'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { TextField, AutoComplete } from 'app/commons/StyledEl'
import { Span } from 'app/components/Typography'
import { DatePicker } from '@mui/lab'

import ProfileLogic from 'app/modules/profile/logic/ProfileLogic';

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const ContentBox = styled(FlexBox)(() => ({
    flexDirection: 'column',
}))


const EditInfo = (props) => {
    const { info, getInfo } = props;
    const { palette } = useTheme()

    const _logic = ProfileLogic();


    console.log('info', info);

    const [state, setState] = useState({
        Address: "",
        Birthdate: new Date(),
        Email: "",
        Gender: "",
        Avatar: "",
        Firstname: "",
        Lastname: "",
        zoomLink: ""
    });

    useEffect(() => {
        setState({
            ...state,
            Email: info.email,
            Address: info.Address,
            Birthdate: new Date(info.birthdate),
            Gender: info.gender,
            Avatar: info.avatar,
            Firstname: info.firstname,
            Lastname: info.lastname,
            zoomLink: info.zoomLink
        })

    }, [])


    console.log('state', state);


    const {
        Address,
        Birthdate,
        Email,
        Gender,
        Firstname,
        Lastname,
        zoomLink
    } = state


    const handleSubmit = async (event) => {
        event.preventDefault();

        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const data = {
            Email: Email,
            Address: Address,
            Birthdate: Birthdate.toLocaleDateString("en-US", options),
            Firstname: Firstname,
            Lastname: Lastname,
            fkUsercount: info.fkUsercount,
            zoomLink: zoomLink,
        }

        const response = await _logic.updateInfo(data);

        if (response) {
            getInfo()
        }
    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }



    const handleDateChange = (date) => {
        console.log('date', date);
        setState({
            ...state,
            Birthdate: new Date(date)
        })
    }


    return (
        <ValidatorForm onSubmit={handleSubmit} onError={() => null} >

            <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <TextField
                        type="text"
                        name="Firstname"
                        onChange={handleChange}
                        value={Firstname || ''}
                        validators={[
                            'required'
                        ]}
                        label="Firstname"


                    />
                    <TextField
                        type="text"
                        name="Lastname"
                        onChange={handleChange}
                        value={Lastname || ''}
                        validators={[
                            'required'
                        ]}
                        label="Lastname"


                    />
                    <TextField
                        type="text"
                        name="Email"
                        onChange={handleChange}
                        value={Email || ''}
                        validators={[
                            'required'
                        ]}
                        label="Email"


                    />

                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={Birthdate}
                            onChange={handleDateChange}
                            renderInput={(props) => (
                                <TextField
                                    {...props}
                                    // variant="Outlined"
                                    id="mui-pickers-date"
                                    label="Birthdate"
                                    sx={{ mb: 2, width: '100%' }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <TextField
                        type="text"
                        name="Address"
                        onChange={handleChange}
                        value={Address || ''}
                        validators={[
                            'required'
                        ]}
                        label="Address"


                    />
                    <TextField
                        type="text"
                        name="zoomLink"
                        onChange={handleChange}
                        value={zoomLink || ''}
                        label="zoomLink"
                    />
                </Grid>
            </Grid>

            <Button color="success" variant="contained" type="submit">
                <Icon>edit</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                    Save Changes
                </Span>
            </Button>
        </ValidatorForm>
    );
};


export default EditInfo;
