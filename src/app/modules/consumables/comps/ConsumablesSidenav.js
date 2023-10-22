import {
    Icon,
    Divider,
    Button,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip
} from '@mui/material'
import React from 'react'
import ConsumableComposeDialog from './ConsumableComposeDialog'
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { styled } from '@mui/system'
import { Items } from "../items";
import ConsumablesLogic from '../logic/ConsumablesLogic';
import CommonLogic from 'app/logic/CommonLogic';

const Container = styled('div')(({ theme }) => ({
    marginRight: '16px',
    background: theme.palette.background.default,
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '100%',
    color: '#fff',
    paddingTop: '8px',
    paddingBottom: '8px',
    background: theme.palette.error.main,
}))

const ConsumablesSidenav = ({ handleSubmit, _setSelectedStatus }) => {
    const _logic = ConsumablesLogic();
    const _commonLogic = CommonLogic();
    const [open, setOpen] = React.useState(false)
    const handleClose = () => {
        setOpen(false)
    }

    // const initItems = async () => {
    //     console.log('Items', Items);

    //     const dataItems = [];

    //     for (const key in Items) {
    //         const first = Items[key];

    //         for (const key2 in first) {
    //             const second = first[key2];

    //             for (const key3 in second) {
    //                 const third = second[key3];
    //                 if (third.length > 0) {
    //                     for (var i = 0; i < third.length; i++) {
    //                         dataItems.push(third[i]);
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     const finalItems = []
    //     for (var i = 0; i < dataItems.length; i++) {
    //         const data = {
    //             itemCode: dataItems[i].id,
    //             keyword: `[${dataItems[i].name}] ${dataItems[i].description}`,
    //             itemName: dataItems[i].name,
    //             description: dataItems[i].description,
    //             qty: parseFloat(dataItems[i].qty)
    //         }

    //         finalItems.push(data);
    //     }

    //     console.log('finalItems', finalItems);

    //     const bodyData = {
    //         addedBy: _commonLogic.getCount(),
    //         items: finalItems
    //     }
    //     const response = await _logic.initItems(bodyData);
    //     console.log('response', response);
    // }

    return (
        <Container>
            <Tooltip title={"New Project"}>
                <StyledButton variant="contained" onClick={() => setOpen(true)}>
                    <Icon size="small" >add</Icon>
                    New Item
                </StyledButton>
            </Tooltip>

            {/* <Tooltip title={"New Project"}>
                <StyledButton variant="contained" onClick={() => initItems()}>
                    <Icon size="small" >add</Icon>
                    initItems
                </StyledButton>
            </Tooltip> */}

            <ListItem button onClick={() => _setSelectedStatus("All")}>
                <ListItemIcon>
                    <Icon>assignment</Icon>
                </ListItemIcon>
                <ListItemText primary="All Items" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus("In-Stock")}>
                <ListItemIcon>
                    <Icon>check_box</Icon>
                </ListItemIcon>
                <ListItemText primary="In Stock" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus("Near-Deplete")}>
                <ListItemIcon>
                    <Icon>timer</Icon>
                </ListItemIcon>
                <ListItemText primary="Near Deplete" />
            </ListItem>
            <ListItem button onClick={() => _setSelectedStatus("Out-of-Stock")}>
                <ListItemIcon>
                    <IndeterminateCheckBoxIcon className={'icon'} />
                </ListItemIcon>
                <ListItemText primary="Out of Stock" />
            </ListItem>

            <Divider />

            <ListItem button onClick={() => _setSelectedStatus("Archived")}>
                <ListItemIcon>
                    <Icon color="secondary">archive</Icon>
                </ListItemIcon>
                <ListItemText primary="Archived" />
            </ListItem>

            <ConsumableComposeDialog open={open} handleClose={handleClose} handleSubmit={handleSubmit} />
        </Container>
    )
}

export default ConsumablesSidenav
