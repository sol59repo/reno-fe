import React, { useState, useEffect, useRef } from 'react'
import { Container } from "../../../commons/StyledEl"
import {
    Breadcrumb
} from 'app/components'
import Frame from '../matterport/Frame';
import { Grid } from '@mui/material'
import ProjectLogic from '../logic/ProjectLogic';
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setOverlayState } from 'app/redux/actions/commonActions'
import { Box, styled } from '@mui/system'
import { Tab, Tabs } from '@mui/material'
import Ticket from '../matterport/modelInfo/tickets/Ticket';
import AddTicketWindow from 'app/modules/projects/matterport/modelInfo/tickets/AddTicketWindow';


let OuterTags;
let refOuterTags;
let pushData = [];
let refPushData = [];


const ProjectDetails = (props) => {
    const _logic = ProjectLogic();
    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const childCompRef = useRef()

    const [refTags, setRefTags] = useState([])
    const [tags, setTags] = useState([])
    const [mpSdk, setMpSdk] = useState(null)
    const [isHideTags, setIsHideTags] = useState(true)
    const [isHideMeasurements, setIsHideMeasurements] = useState(true)
    const [locationName, setLocationName] = useState('')
    const [projectInfo, setProjectInfo] = useState([{ location: "", fkModel: "" }])
    const { location, fkModel } = projectInfo[0]

    const [tabIndex, setTabIndex] = useState(0)

    const [measurements, setMeasurements] = useState([])
    const [tickets, setTickets] = useState([])
    const [type, setType] = useState("ticket");
    const [status, setStatus] = React.useState('All');
    const [filterDisplay, setFilterDisplay] = React.useState([]);
    const [_tag, _setTag] = React.useState('');

    const [open, setOpen] = useState(null);
    const [openData, setOpenData] = useState([]);


    const { id } = useParams();
    const srcEmbed = id;

    OuterTags = tags;
    refOuterTags = refTags;


    useEffect(async () => {
        const response = await _logic.getProjectSpace(id);
        setProjectInfo(response);
        setLocationName(response[0].location);
    }, [])

    const renderTabs = () => {
        const tabList = ['Tickets', 'Measurements']
        const _tabs = tabList.map((item, ind) => (<Tab
            key={ind}
            value={ind}
            label={item}
            sx={{ textTransform: 'capitalize' }}
        />))
        return _tabs
    }

    const handleTabChange = (e, value) => {
        setTabIndex(value)
        if (value == 0) {
            setType("ticket");
            toggleGetTickets()
        } else {
            setType("measurement");
            toggleGetMeasurements();
        }
    }


    useEffect(() => {
        if (type == "ticket") {
            getTickets()
        } else {
            getMeasurements();
        }

    }, []);


    const getTickets = async () => {
        pushData = [];
        refPushData = [];
        const response = await _logic.getTickets(srcEmbed);
        await distributeMeasurements(response);

    }

    const getMeasurements = async () => {
        pushData = [];
        refPushData = [];
        const response = await _logic.getMeasurements(srcEmbed);
        await distributeMeasurements(response);
    }


    const toggleGetTickets = async () => {
        pushData = [];
        refPushData = [];
        const response = await _logic.getTickets(srcEmbed);

        console.log('response', response);

        await distributeMeasurements(response);
        await handlePopulate(mpSdk);
    }


    const toggleGetMeasurements = async () => {
        pushData = [];
        refPushData = [];
        const response = await _logic.getMeasurements(srcEmbed);
        await distributeMeasurements(response);
        await handlePopulate(mpSdk);
    }

    function populateTags(tags, _reftags = []) {
        setTags(tags)
        setRefTags(_reftags)
        _setTag(null)
    }


    const handlePopulate = (mpSdk) => {
        mpSdk.Mattertag.getData()
            .then((tags) => {
                let toRemove = [];
                if (tags.length > 0) {
                    tags.forEach(element => {
                        toRemove.push(element.sid);
                    });
                }
                mpSdk.Mattertag.remove(toRemove);
                populate(mpSdk);
            })
            .catch(console.error);
    }


    const populate = (mpSdk) => {
        if (pushData.length === 0) {
            return;
        }
        mpSdk.Mattertag.add(pushData)
            .then((sid) => {
                return mpSdk.Mattertag.getData();
            })
            .then((collection) => {
                populateTags(collection, refPushData);
                pushData = collection;
            })
            .then(() => {

            })
            .catch((e) => {
            })
    }


    function push(fromArray, toArray) {
        for (let i = 0, len = fromArray.length; i < len; i++) {
            toArray.push(fromArray[i]);
        }
        return toArray;

    }

    function refPush(fromArray, toArray) {
        for (let i = 0, len = fromArray.length; i < len; i++) {
            toArray.push(fromArray[i]);
        }
        return toArray;

    }

    const distributeMeasurements = (data) => {
        if (data.length === 0) {
            setTags([])
            setRefTags([])
            return;
        }

        for (let i = 0; i < data.length; i++) {
            const jsonArr = JSON.parse(data[i].measurements);
            const jsonArr2 = JSON.parse(data[i].measurementDesc);
            push(jsonArr, pushData);
            refPush(jsonArr2, refPushData);
        }

        setTags(pushData)
        setRefTags(refPushData)
    }


    const saveChanges = async () => {
        dispatch(setOverlayState({ active: true, text: "" }))
        const data = {
            measurements: tags,
            measurementDesc: refTags,
            modelId: srcEmbed,
            type: type
        }
        const response = await _logic.saveModelChanges(data);
        if (response) {
            setTags(tags)
            setRefTags(refTags)
        }
    }


    const addNewTag = (tag, _refTag) => {

        console.log('tag 1', tag);
        console.log('_refTag 1', _refTag);

        let initTags = OuterTags;
        let newTags = initTags.concat(tag);

        let initRefTags = refOuterTags;
        let newRefTags = initRefTags.concat(_refTag);

        setTags(newTags);
        setRefTags(newRefTags);

        setOpen(true);
        
        const rowData = {
            ..._refTag,
            sid: tag[0].sid
        }

        setOpenData(rowData);

    }


    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (event) => {
        const status = event.target.value
        setStatus(status);

        let filterTags = tags.filter((val, idx) => {
            if (refTags[idx].status == status) {
                return true;
            }
            return false;
        })

        if (status == "All") {
            filterTags = tags
        }

        setFilterDisplay(filterTags);

        mpSdk.Mattertag.getData()
            .then((tags) => {
                let toRemove = [];
                if (tags.length > 0) {
                    tags.forEach(element => {
                        toRemove.push(element.sid);
                    });
                }
                mpSdk.Mattertag.remove(toRemove);

                if (filterTags.length !== 0) {
                    mpSdk.Mattertag.add(filterTags)
                        .then((sid) => {
                            return mpSdk.Mattertag.getData();
                        })
                        .then((collection) => {
                            console.log('collection', collection);
                        })
                        .then(() => { })
                        .catch((e) => { })
                }

            })
            .catch(console.error);
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

            <div className="headerBG" />
            <div className="sidenavHolder">
                <Grid container spacing={6}>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
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
                                <Ticket
                                    setRefTags={setRefTags}
                                    childCompRef={childCompRef}
                                    saveChanges={saveChanges}
                                    handleChange={handleChange}
                                    tags={status === "All" ? tags : filterDisplay}
                                    refTags={refTags}
                                    mpSdk={mpSdk}
                                    setTags={setTags}
                                    isHideMeasurements={isHideMeasurements}
                                    isHideTags={isHideTags}
                                    locationName={locationName}
                                    status={status}
                                    projectInfo={projectInfo}
                                />
                            </>
                        )}

                    </Grid>
                    <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 2 }}>
                        <Frame
                            refPushData={refPushData}
                            pushData={pushData}
                            ref={childCompRef}
                            srcEmbed={srcEmbed}
                            setTags={setTags}
                            refTags={refTags}
                            setRefTags={setRefTags}
                            _setMpSdk={setMpSdk}
                            addNewTag={addNewTag}
                            _tag={_tag}

                        />
                    </Grid>
                </Grid>
            </div>
            {open && <AddTicketWindow
                handleClose={handleClose}
                data={openData}
                locationName={locationName}
                projectInfo={projectInfo}
                setRefTags={setRefTags}
                refTags={refTags}
                mpSdk={mpSdk}
                tags={tags}
                setTags={setTags}
                open={open}
            />}

        </Container >
    );
};


export default ProjectDetails;