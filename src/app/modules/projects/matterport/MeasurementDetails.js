import React, { useState, useEffect, useRef } from 'react'
import { Grid, CircularProgress, Box } from '@mui/material'
import ProjectLogic from '../logic/ProjectLogic';
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setOverlayState } from 'app/redux/actions/commonActions'
import AddLabelWindow from 'app/modules/projects/matterport/modelInfo/measurements/AddLabelWindow';
import Frame from 'app/modules/projects/matterport/modelInfo/measurements/Frame';
import Measurement from 'app/modules/projects/matterport/modelInfo/measurements/Measurement'





let OuterTags;
let refOuterTags;
let pushData = [];
let refPushData = [];



const MeasurementDetails = ({ setHasChanged }) => {
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


    /////////////////////////////////////////////////// MEASUREMENT STATE 
    const [hasChanges, setHasChanges] = React.useState(false);
    const [measurements, setMeasurements] = useState([]);        // FROM DB
    const [open, setOpen] = useState(null);            // MODAL Add label and description
    const [openData, setOpenData] = useState([]);      // MODAL  modal data
    const [isloadingSdk, setIsloadingSdk] = React.useState(true); // status dropdown
    /////////////////////////////////////////////////// MEASUREMENT STATE 


    console.log('measurements', measurements);


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
                toggleGetMeasuerments();
            }
        }, [2000])
    }, [mpSdk]);

    const toggleGetMeasuerments = async () => {
        const response = await _logic.getMeasurements(srcEmbed);
        let measurementData = [];
        if (response.length !== 0) {
            let jsonString = response[0].measurements;
            jsonString = jsonString.replace(/\\"/g, '"');
            measurementData = JSON.parse(jsonString);
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
                mpSdk.Mattertag.add(measurementData)
                    .then((sid) => {
                        return mpSdk.Mattertag.getData();
                    })
                    .then((collection) => {
                        const mergeData = measurementData.map((val, idx) => {
                            return {
                                ...val,
                                sid: collection[idx].sid
                            }
                        });
                        setMeasurements(mergeData);
                    })
                    .then(() => { })
                    .catch((e) => { })

            })
            .catch(console.error);
    }


    const _setchanges = (bool) => {
        setHasChanges(bool)
        setHasChanged(bool)
    }


    const saveChanges = async () => {
        dispatch(setOverlayState({ active: true, text: "" }))
        const data = {
            measurements: measurements,
            modelId: srcEmbed,
            type: "measurement"
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
        setMeasurements(state => [...state, init])
        setOpen(true);
        setOpenData(init);
        _setchanges(true)
    }


    const handleChange = (event) => {

    }


    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
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
                        <Measurement
                            childCompRef={childCompRef}
                            saveChanges={saveChanges}
                            handleChange={handleChange}
                            tags={measurements}
                            mpSdk={mpSdk}
                            isHideMeasurements={isHideMeasurements}
                            isHideTags={isHideTags}
                            locationName={locationName}
                            projectInfo={projectInfo}
                            measurements={measurements}
                            setMeasurements={setMeasurements}
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

            {open && <AddLabelWindow
                handleClose={handleClose}
                data={openData}
                mpSdk={mpSdk}
                measurements={measurements}
                setMeasurements={setMeasurements}
                open={open}
            />}
        </>
    );
};


export default MeasurementDetails;