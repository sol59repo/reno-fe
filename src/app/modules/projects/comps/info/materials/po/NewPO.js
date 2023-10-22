import React, { useState, useEffect } from 'react'
import "./searchbar.css";
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
import { useParams } from 'react-router-dom'


const FlexBox = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const StyledCell = styled(TableCell)(() => ({
    padding: 0,
}))



const NewPO = ({ materials, _gePO, projectInfo }) => {

    const { palette } = useTheme()
    const textMuted = palette.text.secondary
    const bgError = palette.error.main
    const { enqueueSnackbar } = useSnackbar()
    const _helpers = Helpers();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const [hasError, setHasError] = useState(false);

    const [state, setState] = useState({
        items: [],
        storeName: '',
        store: "",
        selected: [],
        refSelected: [],
        search: ""
    });

    const { id } = useParams();
    const { count } = projectInfo[0]

    const onChange = (actionMeta, newValue) => {
        if (newValue === null) { return }
        setState({
            ...state,
            selected: newValue,
            refSelected: newValue,
        });
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setHasError(false);
        let init = selected;
        var i;
        let hasError = false;
        for (i = 0; i < selected.length; i++) {
            if (selected[i].orderQty < 0
                || selected[i].orderQty === undefined
                || selected[i].orderQty === null
                || selected[i].orderQty === 0) {

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

        await setState({ ...state, selected: init });

        if (hasError) {
            setHasError(true);
            return;
        }

        const data = {
            Items: selected,
            modelId: id,
            addedBy: _commonLogic.getCount(),
            Id: shortid.generate()
        }
        const response = await _logic.addPO(data);
        if (response) {
            _gePO()
            setState({
                ...state,
                selected: [],
                refSelected: [],
            });
        }
    }

    const handleItemChange = (data, key, availableQTY) => {
        console.log(data, key);
        let init = selected;
        init[key] = {
            ...init[key],
            orderQty: isNaN(parseFloat(data)) ? 0 : parseFloat(data)
        }
        triggerState(init);
    }

    const triggerState = (init) => {
        setState({ ...state, selected: init });
        setHasError(false);
    }

    const getStripedStyle = (params) => {
        return { background: params?.hasError === true ? bgError : 'white' };
    }

    const {
        selected,
        refSelected,
        search
    } = state;

    const onInput = (e) => {
        setState({ ...state, [e.target.id]: e.target.value });
    }
    const onFocus = (e) => {
        e.target.parentNode.parentNode.classList.add("focus")
    }
    const onBlur = (e) => {
        e.target.parentNode.parentNode.classList.remove("focus")
    }

    const onClickItem = (item) => {
        if (selected.filter(val => val.itemCode === item.itemCode).length > 0) {
            enqueueSnackbar(`This item is already in the list.`, { variant: 'info' });
            return
        }


        setState({
            ...state,
            selected: [...selected, item],
            refSelected: [...refSelected, item],
        });
    }

    const deleteRow = (item) => {
        setState({
            ...state,
            selected: selected.filter(val => val.itemCode !== item.itemCode),
            refSelected: refSelected.filter(val => val.itemCode !== item.itemCode),
        });
    }



    let filtered = materials.filter((item) =>
        item.keyword.toLowerCase().includes(search.toLowerCase())
    );

    console.log('filtered', filtered);


    return (
        <>
            <div className="wrapper">
                <div className="search">
                    <input
                        id="search"
                        type="search"
                        value={search}
                        placeholder="Search a item by keyword..."
                        onChange={onInput}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        autoComplete="off"
                    />
                    <i className="fas fa-search"></i>
                </div>
                {search.length > 1 && filtered.length > 0 && (
                    <ul className="list">
                        {filtered.map((item) => (
                            <li key={item.itemCode}
                                onClick={() => onClickItem(item)}>
                             {item.keyword}
                                <span>{item.itemCode}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>


            <ValidatorForm onSubmit={handleSubmit} onError={() => null} >
                <SimpleCard >

                    {/* <AutoComplete
                        multiple
                        freeSolo
                        options={materials}
                        getOptionLabel={(option) => option.keyword.toString()}
                        onChange={onChange}
                        value={selected}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="List of consumables"
                                fullWidth
                            />
                        )}
                    /> */}


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
                                    <TableCell colSpan={2} align="center"> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {refSelected.map((item, ind) => (
                                    <TableRow
                                        key={ind}
                                        sx={{ position: 'relative' }}
                                        style={{
                                            padding: '5px 20px',
                                            height: 25,
                                            ...getStripedStyle(selected[ind])
                                        }}
                                    >
                                        <StyledCell colSpan={4} align="left">
                                            <FlexBox>
                                                <Box ml="12px">
                                                    <H5 sx={{ fontSize: '15px' }}>{item?.itemName.toUpperCase()}</H5>
                                                    <Small sx={{ color: textMuted }}>
                                                        CODE:  {item?.itemCode}
                                                    </Small>
                                                </Box>
                                            </FlexBox>
                                        </StyledCell>
                                        <StyledCell colSpan={2} align="left">
                                            <FlexBox>
                                                <Box ml="12px">
                                                    <H5 sx={{ fontSize: '15px' }}>{item?.availableQty}</H5>
                                                </Box>
                                            </FlexBox>
                                        </StyledCell>

                                        <StyledCell colSpan={7} align="left">
                                            <FlexBox>
                                                <IconTextField
                                                    label="Add"
                                                    style={{ margin: 10, width: '80%' }}
                                                    iconStart={<Icon>add</Icon>}
                                                    onChange={(event) => handleItemChange(event.target.value, ind, item.qty)}
                                                    name={`items[${ind}].Add`}
                                                    defaultValue={item.Add || ''}
                                                />
                                            </FlexBox>
                                        </StyledCell>
                                        <StyledCell colSpan={2} align="left">
                                            <FlexBox>
                                                <Icon onClick={() => deleteRow(item)}>delete</Icon>
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
                        <Span >
                            Save Order
                        </Span>
                    </Button>

                </SimpleCard>
            </ValidatorForm>

        </>
    )
}

export default NewPO
