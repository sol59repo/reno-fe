import React, { useState, useEffect, useRef } from 'react'
import { Grid, CircularProgress, Box } from '@mui/material'
import ProjectLogic from '../logic/ProjectLogic';
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setOverlayState } from 'app/redux/actions/commonActions'
import Ticket from 'app/modules/projects/matterport/modelInfo/tickets/Ticket';
import AddTicketWindow from 'app/modules/projects/matterport/modelInfo/tickets/AddTicketWindow';
import Frame from 'app/modules/projects/matterport/modelInfo/tickets/Frame';

let OuterTags;
let refOuterTags;
let pushData = [];
let refPushData = [];

const TicketDetails = ({ setHasChanged }) => {
    const _logic = ProjectLogic();
    const dispatch = useDispatch()
    const childCompRef = useRef()
    const [refTags, setRefTags] = useState([])
    const [tags, setTags] = useState([])
    const [mpSdk, setMpSdk] = useState(null)
    const [isHideTags, setIsHideTags] = useState(true)
    const [isHideMeasurements, setIsHideMeasurements] = useState(true)
    const [locationName, setLocationName] = useState('')
    const [projectInfo, setProjectInfo] = useState([{ location: "", fkModel: "" }])

    const [_tag, _setTag] = React.useState('');



    //////////////////////////////////////////////////// TICKETS STATE
    const [openTicket, setOpenTicket] = useState(false);
    const [ticketData, setTicketData] = useState(null);
    const [open, setOpen] = useState(null);            // MODAL Add label and description
    const [openData, setOpenData] = useState([]);      // MODAL  modal data
    const [tickets, setTickets] = useState([]);        // FROM DB
    const [mattertags, setMattertags] = useState([]);  // LOCAL DATA
    const [filterDisplay, setFilterDisplay] = React.useState([]); // filter by status
    const [status, setStatus] = React.useState('All'); // status dropdown
    const [hasChanges, setHasChanges] = React.useState(false); // status dropdown
    const [isloadingSdk, setIsloadingSdk] = React.useState(true); // status dropdown
    const refTickets = tickets;
    ////////////////////////////////////////////////////TICKETS STATE

    const { id } = useParams();
    const srcEmbed = id;

    OuterTags = tags;
    refOuterTags = refTags;

    useEffect(() => {
        const unloadCallback = (event) => {
            if (!hasChanges) {
                return;
            }

            event.preventDefault();
            event.returnValue = "";
            return "";
        };

        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, [hasChanges]);

    useEffect(async () => {
        const response = await _logic.getProjectSpace(id);
        setProjectInfo(response);
        setLocationName(response[0].location);
    }, [])


    useEffect(() => {
        setTimeout(() => {
            if (mpSdk !== null) {
                setIsloadingSdk(false)
                toggleGetTickets();
            }
        }, [2000])
    }, [mpSdk])


    const _setchanges = (bool) => {
        setHasChanges(bool)
        setHasChanged(bool)
    }

    const toggleGetTickets = async () => {
        const response = await _logic.getTickets(srcEmbed);
        let ticketData = [];
        if (response.length !== 0) {
            let jsonString = response[0].measurements;
            jsonString = jsonString.replace(/\\"/g, '"');
            ticketData = JSON.parse(jsonString);
        }

        mpSdk.Mattertag.getData()
            .then((tags) => {
                let toRemove = [];
                if (tags.length > 0) {
                    tags.forEach(element => {
                        toRemove.push(element.sid);
                    });
                }

                mpSdk.Mattertag.remove(toRemove);

                mpSdk.Mattertag.add(ticketData)
                    .then((sid) => {
                        return mpSdk.Mattertag.getData();
                    })
                    .then((collection) => {
                        const mergeData = ticketData.map((val, idx) => {
                            return {
                                ...val,
                                sid: collection[idx].sid
                            }
                        });
                        setTickets(mergeData);
                    })
                    .then(() => { })
                    .catch((e) => { })

            })
            .catch(console.error);
    }


    const saveChanges = async () => {
        dispatch(setOverlayState({ active: true, text: "" }))
        const data = {
            measurements: tickets,
            modelId: srcEmbed,
            type: "ticket"
        }
        const response = await _logic.saveModelChanges(data);
        if (response) {
            setTags(tags)
            setRefTags(refTags)
            _setchanges(false)
        }
    }


    const addNewTag = (tag, _refTag, mpSdk) => {
        const init = { ...tag[0], ..._refTag }
        setTickets(state => [...state, init])
        setOpen(true);
        setOpenData(init);
        _setchanges(true)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (event) => {
        const status = event.target.value
        setStatus(status);

        let filterTags = tickets.filter((val, idx) => {
            if (val.status == status) {
                return true;
            }
            return false;
        })

        if (status == "All") {
            filterTags = tickets
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
                            console.log('collection================', collection);
                            const mergeData = tickets.map((val, idx) => {
                                return {
                                    ...val,
                                    sid: collection[idx].sid
                                }
                            });
                            setTickets(mergeData);
                        })
                        .then(() => { })
                        .catch((e) => { })
                }

            })
            .catch(console.error);
    }


    return (
        <>
            <div className="headerBG" />
            <div className="sidenavHolder">
                <Grid container spacing={6}>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                        {isloadingSdk ?
                            <Box py={2} sx={{
                                width: "100%",
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex'
                            }}>
                                <CircularProgress className="progress" color="info" />
                            </Box>

                            :
                            <Ticket
                                childCompRef={childCompRef}
                                saveChanges={saveChanges}
                                handleChange={handleChange}
                                tags={status === "All" ? tickets : filterDisplay}
                                mpSdk={mpSdk}
                                isHideMeasurements={isHideMeasurements}
                                isHideTags={isHideTags}
                                locationName={locationName}
                                status={status}
                                projectInfo={projectInfo}
                                tickets={tickets}
                                setTickets={setTickets}
                                hasChanges={hasChanges}
                                _setchanges={_setchanges}
                            />
                        }


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
                mpSdk={mpSdk}
                tickets={tickets}
                setTickets={setTickets}
                open={open}
            />}

        </>
    );
};


export default TicketDetails;