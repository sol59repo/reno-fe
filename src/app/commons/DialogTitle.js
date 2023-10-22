import React from 'react';
import { DialogTitle  as DiaTitle} from '@mui/material';

const DialogTitle = (props) => {
    return (
        <DiaTitle id={props.id} {...props}>
            {props.children}
        </DiaTitle>
    );
};



export default DialogTitle;
