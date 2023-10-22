import React, { useState, useEffect } from 'react';
import { Container } from "../../../commons/StyledEl"
import { Box } from '@mui/system'
import {
    Breadcrumb
} from 'app/components'
import { Tab, Tabs, Divider, Grid } from '@mui/material'
import CommonLogic from "app/logic/CommonLogic";
import ProfileLogic from 'app/modules/profile/logic/ProfileLogic';
import BasicInfo from '../comps/BasicInfo';
import EditInfo from '../comps/EditInfo';


const Info = (props) => {
    const _commonLogic = CommonLogic();
    const _logic = ProfileLogic();
    const [tabIndex, setTabIndex] = useState(0)
    const [info, setInfo] = useState([])

    const path = _commonLogic.getUrlPath();
    const id = path[2]


    useEffect(() => {
        getInfo();
    }, [])

    const getInfo = async () => {
        const response = await _logic.getEmployee(id);
        setInfo(response[0]);
    }


    const handleTabChange = (e, value) => {
        setTabIndex(value)
    }

    const renderTabs = (_usertype) => {
        let tabList = ['Basic Information', 'Update Information'];
        if (_usertype === "Superadmin") {

            if (_commonLogic.getCount() == info?.fkUsercount) {
                tabList = ['Basic Information', 'Update Information'];
            } else {
                tabList = ['Basic Information'];
            }
        }

        const _tabs = tabList.map((item, ind) => (<Tab
            key={ind}
            value={ind}
            label={item}
            sx={{ textTransform: 'capitalize' }}
        />))

        return _tabs
    }

    const { usertype } = info;

    console.log(info);

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Employee', path: `/staffs/list` },
                        { name: "Profile" },
                    ]}
                />
            </div>

            <Tabs
                sx={{ mt: 2 }}
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                {renderTabs(usertype)}
            </Tabs>

            <Divider sx={{ mb: '24px' }} />

            {tabIndex === 0 && <>
                <BasicInfo info={info} getInfo={getInfo} />
            </>}

            {tabIndex === 1 && <>
                <EditInfo info={info} getInfo={getInfo} />
            </>}
        </Container>
    );
};


export default Info;