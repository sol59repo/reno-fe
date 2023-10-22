import React, { useState, useEffect } from 'react'
import {
    Button,
    Icon,
    Grid,
} from '@mui/material'
import { Span } from 'app/components/Typography'
import { ValidatorForm } from 'react-material-ui-form-validator'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { TextField, AutoComplete } from "../../../commons/StyledEl"
import Helpers from "../../../utils/Helpers"
import { useDispatch, useSelector } from 'react-redux'
import Logic from '../logic/Logic'



const AddStaffForm = (props) => {
    const _helpers = Helpers();
    const _logic = Logic()
    const { _submitNewStaff } = props;


    const [state, setState] = useState({
        birthdate: new Date(),
    })


    useEffect(() => {
        _initAccount();
    }, []);

    const _initAccount = () => {
        const user_password = _helpers.generateUserId();
        setState({
            ID: user_password,
            password: user_password,
            birthdate: new Date(),
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const data = {
            gender: gender,
            birthdate: birthdate.toLocaleDateString("en-US", options),
            firstname: firstname,
            lastname: lastname,
            address: address,
            ID: ID,
            password: password,
            email: email,
            usertype: usertype
        }

        const response = _submitNewStaff(data);
        if (response) {
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
            date: new Date(),
        })
        _initAccount();
    }

    const handleDateChange = (date) => {
        setState({ ...state, date })
    }

    const {
        firstname,
        lastname,
        birthdate,
        gender,
        address,
        password,
        ID,
        email,
        usertype
    } = state


    const onGnderChange = (actionMeta, newValue) => {
        if (newValue === null) {
            return
        }
        setState({
            ...state,
            gender: newValue.value
        })
    }

    const onUsertypeChange = (actionMeta, newValue) => {
        if (newValue === null) {
            return
        }
        setState({
            ...state,
            usertype: newValue.value
        })
    }


    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null} >
  
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <TextField
                            type="text"
                            name="ID"
                            onChange={handleChange}
                            value={ID || ''}
                            validators={[
                                'required'
                            ]}
                            label="ID"
                            inputProps={
                                { readOnly: true, }
                            }

                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <TextField
                            type="text"
                            name="password"
                            onChange={handleChange}
                            value={password || ''}
                            validators={[
                                'required'
                            ]}
                            label="Password"
                            inputProps={
                                { readOnly: true, }
                            }

                        />
                    </Grid>
                </Grid>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <AutoComplete
                            options={[
                                { value: "Admin", label: "Admin" },
                                { value: "Staff", label: "Staff" }
                            ]}
                            getOptionLabel={(option) => option.label}
                            onChange={onUsertypeChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Usertype "
                                    variant="outlined"
                                    name="usertype"
                                    value={usertype || ''}
                                    fullWidth
                                    validators={[
                                        'required'
                                    ]}
                                    errorMessages={['this field is required']}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                        <TextField
                            type="text"
                            name="firstname"
                            onChange={handleChange}
                            value={firstname || ''}
                            validators={[
                                'required'
                            ]}
                            label="Firstname"
                            errorMessages={['this field is required']}
                        />

                        <TextField
                            type="text"
                            name="lastname"
                            onChange={handleChange}
                            value={lastname || ''}
                            validators={[
                                'required'
                            ]}
                            label="Lastname"
                            errorMessages={['this field is required']}
                        />
                        <TextField
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={email || ''}
                            validators={['required', 'isEmail']}
                            label="Email"
                            errorMessages={['this field is required']}
                        />
                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={birthdate}
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

                        <AutoComplete
                            options={[
                                { value: "Male", label: "Male" },
                                { value: "Female", label: "Female" }
                            ]}
                            getOptionLabel={(option) => option.label}
                            onChange={onGnderChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Gender "
                                    variant="outlined"
                                    name="gender"
                                    value={gender || ''}
                                    fullWidth
                                    validators={[
                                        'required'
                                    ]}
                                    errorMessages={['this field is required']}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid>
                    <TextField
                        type="text"
                        name="address"
                        onChange={handleChange}
                        value={address || ''}
                        validators={[
                            'required'
                        ]}
                        label="Address"
                        errorMessages={['this field is required']}
                    />
                </Grid>
                <Button color="success" variant="contained" type="submit">
                    <Icon>send</Icon>
                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                        Submit
                    </Span>
                </Button>
            </ValidatorForm>
        </div>
    )
}

export default AddStaffForm
