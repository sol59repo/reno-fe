/** 
* @desc - Defines a custom styled component from matx
* @author - Gevie l. Pitogo 
**/

import { TextValidator } from 'react-material-ui-form-validator'
import { styled } from '@mui/system'
import {
    Table,
    MenuItem,
    Autocomplete,
    Button,
    Box,
    TextField as ITextField
} from '@mui/material'
import InputAdornment from "@mui/material/InputAdornment";


export const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px',
        },
    },
}));


export const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: 'pre',
    '& thead': {
        '& tr': {
            '& th': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    },
    '& tbody': {
        '& tr': {
            '& td': {
                paddingLeft: 0,
                textTransform: 'capitalize',
            },
        },
    },
}));


export const Small = styled('small')(({ bgcolor }) => ({
    height: 15,
    width: 50,
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    overflow: 'hidden',
    background: bgcolor,
    boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
}));


export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:focus': {
        backgroundColor: theme.palette.primary.light,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.common.white,
        },
    },
}));


export const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

export const AutoComplete = styled(Autocomplete)(() => ({
    // width: 300,
    marginBottom: '16px',
}))

export const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}))


export const StyledItem = styled(MenuItem)(() => ({
    display: 'flex',
    alignItems: 'center',
    '& .icon': { marginRight: '16px' },
}))

export const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))


export const IconTextField = ({ iconStart, iconEnd, InputProps, ...props }) => {
    return (
        <ITextField
            {...props}
            InputProps={{
                ...InputProps,
                startAdornment: iconStart ? (
                    <InputAdornment position="start">{iconStart}</InputAdornment>
                ) : null,
                endAdornment: iconEnd ? (
                    <InputAdornment position="end">{iconEnd}</InputAdornment>
                ) : null
            }}
        />
    );
}
