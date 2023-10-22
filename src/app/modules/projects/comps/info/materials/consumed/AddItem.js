import React, { useState, useEffect } from 'react'
import {
    Button,
    Icon,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton
} from '@mui/material'
import { Span } from 'app/components/Typography'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { TextField, AutoComplete } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import { useDispatch, useSelector } from 'react-redux'
import CommonLogic from "app/logic/CommonLogic"
import { useSnackbar } from 'notistack'
import { SimpleCard } from 'app/components'
import { Box, styled } from '@mui/system'
import QtyUpdates from './QtyUpdates'
import ProjectLogic from '../../../../logic/ProjectLogic'


const FlexBox = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const StyledCell = styled(TableCell)(() => ({
    padding: 0,
}))



const AddItem = ({ refMaterialsLists, _getAsignedMaterials, projectInfo }) => {
    const { enqueueSnackbar } = useSnackbar()
    const _helpers = Helpers();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const [allMaterials, setAllMaterials] = useState([]);
    const [selected, setSelected] = useState([]);

    const [state, setState] = useState({
        items: [],
        storeName: '',
        store: ""
    });

    const path = _commonLogic.getUrlPath();
    const modelId = path[2];
    const { count } = projectInfo[0]

    useEffect(() => {
        getAllMaterials()
    }, []);


    const getAllMaterials = async () => {
        const response = await _logic.getAllMaterials();
        setAllMaterials(response);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selected.length === 0) {
            enqueueSnackbar(`Please select material!`, { variant: 'error' });
            return;
        }

        const data = {
            materials: selected,
            fkProject: count,
            addedBy: _commonLogic.getCount()
        }

        const response = await _logic.addMaterial(data);
        if (response.status) {
            _getAsignedMaterials();
            setSelected([]);
        }
    }

    const onChange = (actionMeta, newValue) => {
        if (newValue === null) { return }
        setSelected(newValue);
    }

    const isInArray = (refMaterialsLists, obj) => {
        var i;
        for (i = 0; i < refMaterialsLists.length; i++) {
            if (refMaterialsLists[i].count === obj.count) {
                return true;
            }
        }
        return false;
    }


    const filteredMaterial = allMaterials.filter((val) => {
        if (isInArray(refMaterialsLists, val))
            return false;
        return true;
    });


    return (
        <SimpleCard title={"Enter consumed quantity"}>
            <QtyUpdates
                refMaterialsLists={refMaterialsLists}
                _getAsignedMaterials={_getAsignedMaterials}
            />
        </SimpleCard>
    )
}

export default AddItem
