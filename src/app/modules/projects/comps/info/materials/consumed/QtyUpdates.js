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
    IconButton,
    MenuItem,
    Tab, Tabs,
} from '@mui/material'
import { Span } from 'app/components/Typography'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { AutoComplete } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import { useDispatch, useSelector } from 'react-redux'
import ProjectLogic from '../../../../logic/ProjectLogic'
import CommonLogic from "app/logic/CommonLogic"
import { useSnackbar } from 'notistack'
import { SimpleCard } from 'app/components'
import { Box, styled, useTheme } from '@mui/system'
import { H5 } from 'app/components/Typography'
import { Small, FlexBox, IconTextField } from 'app/commons/StyledEl'
import Add from './Add'
import Minus from './Minus'

const StyledCell = styled(TableCell)(() => ({
    padding: 0,
}))


const QtyUpdates = ({ refMaterialsLists, _getAsignedMaterials }) => {
    const { palette } = useTheme()
    const textMuted = palette.text.secondary
    const { enqueueSnackbar } = useSnackbar()
    const _helpers = Helpers();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const [initLists, setInitLists] = useState([]);
    const [lists, setLists] = useState(refMaterialsLists);
    const [tabIndex, setTabIndex] = useState(0)



    const renderTabs = () => {
        const tabList = ['Consumed']
        // const tabList = ['Additional', 'Consumed']
        const _tabs = tabList.map((item, ind) => (<Tab
            key={ind}
            value={ind}
            label={item}
            sx={{ textTransform: 'capitalize' }}
        />))

        return _tabs
    }
    const handleTabChange = (e, value) => {
        setTabIndex(value)
    }

    return (
        <>
            {/* <Tabs
                sx={{ mt: 2 }}
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                {renderTabs()}
            </Tabs> */}

            {/* {tabIndex === 0 &&
                <Add refMaterialsLists={refMaterialsLists} _getAsignedMaterials={_getAsignedMaterials} />
            } */}

            {/* {tabIndex === 0 &&
                <Minus refMaterialsLists={refMaterialsLists} _getAsignedMaterials={_getAsignedMaterials} />
            } */}

            <Minus refMaterialsLists={refMaterialsLists} _getAsignedMaterials={_getAsignedMaterials} />

        </>
    )
}

export default QtyUpdates
