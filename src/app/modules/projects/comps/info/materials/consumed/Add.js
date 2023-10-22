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
    Alert
} from '@mui/material'
import { Span } from 'app/components/Typography'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { AutoComplete } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import { useDispatch, useSelector } from 'react-redux'
import ProjectLogic from "../../../../logic/ProjectLogic"
import CommonLogic from "app/logic/CommonLogic"
import { useSnackbar } from 'notistack'
import { SimpleCard } from 'app/components'
import { Box, styled, useTheme } from '@mui/system'
import { H5 } from 'app/components/Typography'
import { Small, FlexBox, IconTextField } from 'app/commons/StyledEl'
import { useParams } from 'react-router-dom'


const StyledCell = styled(TableCell)(() => ({
    padding: 0,
}))


const Add = ({ refMaterialsLists, _getAsignedMaterials }) => {
    const { palette } = useTheme()
    const { id } = useParams()
    const textMuted = palette.text.secondary
    const bgError = palette.error.main
    const { enqueueSnackbar } = useSnackbar()
    const _helpers = Helpers();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const [lists, setLists] = useState([]);
    const [hasError, setHasError] = useState(false);

    const initLists = refMaterialsLists


    useEffect(() => {
        const _state = refMaterialsLists.map((val) => {
            return {
                Add: "",
                count: val.count,
                qty: val.qty,
                type: "Add",
                newQty: val.qty,
                hasError: false
            }
        })

        setLists(_state);
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();

        let init = lists;
        var i;
        let hasError = false;
        for (i = 0; i < lists.length; i++) {
            if (lists[i].newQty < 0) {
                hasError = true;
                init[i] = {
                    ...init[i],
                    hasError: true
                }
            } else {
                init[i] = {
                    ...init[i],
                    hasError: false
                }
            }
        }

        setLists(init);

        if (hasError) {
            setHasError(true);
            return;
        }

        const data = {
            data: lists,
            modelId: id,
            addedBy: _commonLogic.getCount()
        }

        const response = await _logic.qtyUpdate(data);
        if (response) {
            _getAsignedMaterials();
        }

    }


    const getStripedStyle = (params) => {
        return { background: params?.hasError === true ? bgError : 'white' };
    }



    const handleItemChange = (data, key, type) => {
        let init = lists;
        init[key] = {
            ...init[key],
            [type]: data,
            newQty: parseFloat(data) + parseFloat(init[key].qty)
        }

        setLists(init)
    }


    return (
        <>
            <Divider sx={{ mb: '24px' }} />
            <ValidatorForm onSubmit={handleSubmit} onError={() => null} >
                <SimpleCard title={"Quantity Updates"}>
                    <Box overflow="auto">
                        {hasError &&
                            <Alert
                                sx={{ m: 1 }}
                                severity="error"
                                variant="filled"
                            >
                                Error! Please review Quantity entered.
                            </Alert>
                        }
                        <Divider sx={{ mb: '24px' }} />

                        <Table sx={{ whiteSpace: 'pre', minWidth: 750 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={4}>Item Details</TableCell>
                                    <TableCell colSpan={2}>Avaiable Qty</TableCell>
                                    <TableCell colSpan={7} align="center">Quantity </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initLists.map((item, ind) => (
                                    <TableRow
                                        key={ind}
                                        sx={{ position: 'relative' }}
                                        style={{
                                            padding: '5px 20px',
                                            height: 25,
                                            ...getStripedStyle(lists[ind])
                                        }}
                                    >
                                        <StyledCell colSpan={4} align="left">
                                            <FlexBox>
                                                <Box ml="12px">
                                                    <H5 sx={{ fontSize: '15px' }}>{item?.itemName}</H5>
                                                    <Small sx={{ color: textMuted }}>
                                                        CODE:  {item?.itemCode}
                                                    </Small>
                                                </Box>
                                            </FlexBox>
                                        </StyledCell>
                                        <StyledCell colSpan={2} align="left">
                                            <FlexBox>
                                                <Box ml="12px">
                                                    <H5 sx={{ fontSize: '15px' }}>{item?.qty}</H5>
                                                </Box>
                                            </FlexBox>
                                        </StyledCell>

                                        <StyledCell colSpan={7} align="left">
                                            <FlexBox>
                                                <IconTextField
                                                    label="Add"
                                                    style={{ margin: 10, width: '80%' }}
                                                    iconStart={<Icon>add</Icon>}
                                                    onChange={(event) => handleItemChange(event.target.value, ind, "Add")}
                                                    name={`items[${ind}].Add`}
                                                    defaultValue={item.Add || ''}
                                                />
                                            </FlexBox>
                                        </StyledCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                    <Divider sx={{ mb: '24px' }} />
                    <Button color="success" variant="contained" type="submit">
                        <Icon>save</Icon>
                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                            Save Shanges
                        </Span>
                    </Button>
                </SimpleCard>

            </ValidatorForm>
        </>
    )
}

export default Add
