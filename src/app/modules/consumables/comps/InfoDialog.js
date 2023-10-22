import React, { useState, useEffect } from 'react';
import { Dialog, Button, Icon, Grid, Tab, Tabs, } from '@mui/material';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Box, styled, useTheme } from '@mui/system'
import { TextField } from 'app/commons/StyledEl';
import { H5, Paragraph, Span } from 'app/components/Typography';
import EditTab from './EditTab';
import InfoTab from './InfoTab';


const InfoDialog = (props) => {
    const { open, handleClose, _submitChanges, Info, _filterImtem, setInfo } = props

    const [tabIndex, setTabIndex] = useState(0)

    const handleTabChange = (e, value) => {
        setTabIndex(value)
    }

    const renderTabs = () => {
        const tabList = ['Info', 'Edit']
        const _tabs = tabList.map((item, ind) => (<Tab
            key={ind}
            value={ind}
            label={item}
            sx={{ textTransform: 'capitalize' }}
        />))

        return _tabs
    }


    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth={true}
            onClose={handleClose}
        >

            <Tabs
                sx={{ mt: 2 }}
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                {renderTabs()}
            </Tabs>
            {tabIndex === 0 && <>
                <InfoTab Info={Info} />
            </>}

            {tabIndex === 1 && <>
                <EditTab _submitChanges={_submitChanges} Info={Info} _filterImtem={_filterImtem} setInfo={setInfo} />
            </>}
        </Dialog>
    );
};


export default InfoDialog;