import React, { useState, useEffect } from 'react'
import {
    Button,
    Icon,
    Grid,
    Chip,
    Avatar
} from '@mui/material'
import { Span } from 'app/components/Typography'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { TextField, AutoComplete } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import { useDispatch, useSelector } from 'react-redux'
import ProjectLogic from "../../../logic/ProjectLogic"
import CommonLogic from "app/logic/CommonLogic"
import { Box, styled, useTheme } from '@mui/system'
import { useSnackbar } from 'notistack'

const StyledAvatar = styled(Avatar)(() => ({
    height: '32px',
    width: '32px',
}))


const AsignManager = ({ refManagersLists,_getAsignedManager }) => {
    const { enqueueSnackbar } = useSnackbar()
    const _helpers = Helpers();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const [allManagers, setAllManagers] = useState([]);
    const [selected, setSelected] = useState([]);

    const path = _commonLogic.getUrlPath();
    const modelId = path[2];

    useEffect(() => {
        getAllManagers()
    }, []);


    const getAllManagers = async () => {
        const response = await _logic.getAllManagers();
        setAllManagers(response);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selected.length === 0) {
            enqueueSnackbar(`Please select staff!`, { variant: 'error' });
            return;
        }

        const data = {
            staffs: selected,
            modelId: modelId,
            addedBy: _commonLogic.getCount()

        }

        const response = await _logic.asignStaff(data);
        if (response.status) {
            _getAsignedManager();
            setSelected([]);
        }
    }

    const onChange = (actionMeta, newValue) => {
        if (newValue === null) { return }
        setSelected(newValue);
    }

    const isInArray = (refManagersLists, obj) => {
        var i;
        for (i = 0; i < refManagersLists.length; i++) {
            if (refManagersLists[i].ID === obj.ID) {
                return true;
            }
        }
        return false;
    }


    const filteredManager = allManagers.filter((val) => {
        if (isInArray(refManagersLists, val))
            return false;
        return true;
    });


    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null} >
                <Grid container spacing={6}>
                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                        <Box
                            ml="-0.875rem"
                            display="flex"
                            position="relative"
                        >
                            {selected.map((member) => (
                                <StyledAvatar
                                    key={member.count}
                                    src={member.avatar}
                                    style={{ margin: 3 }}
                                />
                            ))}
                        </Box>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                        <AutoComplete
                            multiple
                            freeSolo
                            options={filteredManager}
                            getOptionLabel={(option) => option.empName.toString()}
                            onChange={onChange}
                            value={selected}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Staffs"
                                    fullWidth
                                />
                            )}
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
        </div>
    )
}

export default AsignManager
