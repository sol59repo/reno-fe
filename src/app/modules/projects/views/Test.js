import React, { useState, useEffect, useRef } from 'react'
import { Container } from "../../../commons/StyledEl"
import {
    Breadcrumb
} from 'app/components'
import { Tab, Tabs } from '@mui/material'
import ProjectLogic from '../logic/ProjectLogic';
import { useLocation, useParams } from 'react-router-dom'
import TicketDetails from '../matterport/DEVTicketDetails';
import { AlertConfirm } from 'app/commons';


const Test = props => {
    const _logic = ProjectLogic();
    const { id } = useParams();

    const [hasChanged, setHasChanged] = useState(false)
    const [tabIndex, setTabIndex] = useState(0)
    const [projectInfo, setProjectInfo] = useState([{ location: "", fkModel: "" }])
    const { location, fkModel } = projectInfo[0]

    useEffect(async () => {
        const response = await _logic.getProjectSpace(id);
        setProjectInfo(response);
    }, [])


    const handleChange = (value) => {
        AlertConfirm({
            callback: () => _continue(value),
            title: 'You have unpublished jobs for this tab session.',
            text: "Data would be lost. Please confirm!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed to next tab!',
            cancelButtonText: "No, stay here!"
        });
    }


    const handleTabChange = (e, value) => {
        if (hasChanged) {
            handleChange(value)
            return;
        }

        setTabIndex(value)
    }

    const _continue = (value) => {
        setTabIndex(value)
        setHasChanged(false)
    }

    const renderTabs = () => {
        const tabList = ['Tickets']
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
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Projects', path: `/projects/list` },
                        { name: location, path: `/project-info/${fkModel}` },
                        { name: 'Matterport', }
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
                {renderTabs()}
            </Tabs>

            {tabIndex === 0 && (
                <>
                    <TicketDetails setHasChanged={setHasChanged} />
                </>
            )}

        </Container >
    );
};


export default Test;