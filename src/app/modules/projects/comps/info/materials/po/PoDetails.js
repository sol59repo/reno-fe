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
import { borderColor, Box, styled, useTheme } from '@mui/system'
import ProjectLogic from '../../../../logic/ProjectLogic'
import { H5 } from 'app/components/Typography'
import { Small, IconTextField } from 'app/commons/StyledEl'
import shortid from "shortid"

const FlexBox = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const StyledCell = styled(TableCell)(() => ({
    padding: 10,
}))



const PoDetails = ({ poData, poId }) => {
    const { palette } = useTheme()
    const textMuted = palette.text.secondary
    const { enqueueSnackbar } = useSnackbar()
    const _helpers = Helpers();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const [selected, setSelected] = useState([]);

    const [state, setState] = useState({
        items: [],
        storeName: '',
        store: ""
    });

    const path = _commonLogic.getUrlPath();

    return (
        <SimpleCard title={`Order details for the PO Id: ${poId}`}>
            <Box overflow="auto">
                <Divider sx={{ mb: '24px' }} />

                <Table sx={{ whiteSpace: 'pre', minWidth: 750 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={6} align="center">Item Details</TableCell>
                            <TableCell colSpan={6} align="center">Ordered Quantity </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {poData.map((item, ind) => (
                            <TableRow
                                key={ind}
                                sx={{ position: 'relative' }}
                            >
                                <StyledCell colSpan={6} align="center">
                                    {item.itemName}
                                </StyledCell>
                                <StyledCell colSpan={6} align="center">
                                    {item.orderQty}
                                </StyledCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

        </SimpleCard>
    )
}

export default PoDetails
