import React, { useState, useEffect } from 'react';
import { Container } from "../../../commons/StyledEl"
import { Box } from '@mui/system'
import {
    Breadcrumb
} from 'app/components'
import { Tab, Tabs, Divider, Grid } from '@mui/material'
import CommonLogic from "app/logic/CommonLogic"
import ConsumablesLogic from '../logic/ConsumablesLogic';
import ConsumablesList from './ConsumablesList';
import PurchaseOrder from './PurchaseOrder';

const Consumables = (props) => {

    const _commonLogic = CommonLogic();
    const _logic = ConsumablesLogic();
    const [tabIndex, setTabIndex] = useState(0)

    const path = _commonLogic.getUrlPath();
    const modelId = path[2];

    const handleTabChange = (e, value) => {
        setTabIndex(value)
    }

    const renderTabs = () => {
        const tabList = ['Consumables', 'Orders']
        const _tabs = tabList.map((item, ind) => (<Tab
            key={ind}
            value={ind}
            label={item}
            sx={{ textTransform: 'capitalize' }}
        />))

        return _tabs
    }

    return (
        <Container>

            <Breadcrumb
                routeSegments={[
                    { name: 'Consumables', path: '/projects/list' },
                ]}
            />

            <Tabs
                sx={{ mt: 2 }}
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                {renderTabs()}
            </Tabs>

            <Divider
                sx={{ mb: '10px' }}
            />

            {tabIndex === 0 &&
                <ConsumablesList />
            }

            {tabIndex === 1 &&
                <PurchaseOrder />
            }

        </Container >
    );
};


export default Consumables;