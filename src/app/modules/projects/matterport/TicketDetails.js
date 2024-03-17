import "./modelInfo/tickets/style.css"
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useParams } from 'react-router-dom'
import { Grid, Icon, Button } from '@mui/material'
import ProjectLogic from '../logic/ProjectLogic';
import { useDispatch } from "react-redux";
import { setOverlayState } from 'app/redux/actions/commonActions'
import { useSnackbar } from 'notistack'
import CommentDialog from "./modelInfo/tickets/CommentDialog";
import Helpers from 'app/utils/Helpers';
import { Box } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



const colors = {
    Pending: { r: 1, g: 0, b: 0 },
    InProgress: { r: 0.9, g: 0.9, b: 0 },
    Completed: { r: 0.0, g: 0.0, b: 1.0 }
}


let iframe;
let publishBtn;
let addTagBtn;
let container;
let MPSDK;
let tag;
let selectElement;
let table_container;
let tickets = []

const TicketDetails = forwardRef((props, ref) => {
    const _helpers = Helpers();
    const { enqueueSnackbar } = useSnackbar()
    const { id } = useParams();
    const [status, setStatus] = React.useState('All'); // status dropdown
    const [sdkKey] = useState("5ay99an96gm75gqbi7fnhkpta");
    const [isFirefox] = useState(navigator.userAgent.indexOf("Firefox") > -1);
    const [locationName, setLocationName] = useState('')
    const [projectInfo, setProjectInfo] = useState([{ location: "", fkModel: "" }])
    const [openData, setOpenData] = useState(null);
    const [hasChanges, setHasChanges] = React.useState(false); // status dropdown
    const _logic = ProjectLogic();
    const dispatch = useDispatch()

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


    useEffect(() => {
        const showcaseLoader = (iframe) => {
            try {
                window.MP_SDK.connect(iframe, sdkKey, '3.10')
                    .then(loadedShowcaseHandler)
                    .catch(console.error);
            } catch (e) {
                console.error(e);
            }
        };

        // Initialize logic
        const initialize = () => {
            iframe = document.querySelector('.showcase');
            container = document.querySelector('.showcase_container');
            addTagBtn = document.querySelector('.add_tag');
            publishBtn = document.querySelector('.publishBtn');
            table_container = document.querySelector(".scrollable");
            iframe.setAttribute('src', `https://my.matterport.com/show/?m=${id}&help=0&play=1&qs=1&gt=0&hr=0`);
            iframe.addEventListener('load', () => showcaseLoader(iframe));


            selectElement = document.createElement('select');
            selectElement.setAttribute('labelId', 'demo-simple-select-label');
            selectElement.setAttribute('id', 'demo-simple-select');
            selectElement.value = status;
            selectElement.style.width = '100px';
            selectElement.style.padding = '8px';
            selectElement.style.border = '1px solid #ccc';

            // Create and append option elements
            const options = ["All", "InProgress", "Completed", "Pending"];
            options.forEach(optionValue => {
                const optionElement = document.createElement('option');
                optionElement.setAttribute('value', optionValue);
                optionElement.textContent = optionValue === "InProgress" ? "In-progress" : optionValue; // Adjusting text for In-progress
                selectElement.appendChild(optionElement);
            });

            // Append select element to a parent element in the DOM
            const parentElement = document.getElementById('parent_select'); // Replace 'parentElementId' with the actual ID of the parent element
            parentElement.appendChild(selectElement);

        };

        initialize();

        return () => {
            // Cleanup logic (if needed)
        };
    }, []); // Empty dependency array means it runs only once on mount


    useEffect(() => {
        const getProjectSpace = async () => {
            const response = await _logic.getProjectSpace(id);
            if (response) {
                setProjectInfo(response);
                if (response.length > 0) {
                    setLocationName(response[0].location);
                }
            }
        }
        getProjectSpace();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])


    const populateTags = (tags, sort = 'label') => {
        const curTags = document.querySelectorAll('.scrollable tr');
        curTags.forEach((tag) => {
            tag.remove();
        });
        tags.forEach(addToTable);
    };

    const addToTable = (tag) => {
        let elem;
        let row;

        if (table_container && table_container.children[0] && table_container.children[0].tagName === 'THEAD') {
            // If THEAD exists, add TBODY after it
            table_container.insertBefore(document.createElement('TBODY'), table_container.children[0].nextSibling);
        }

        // Create a new row
        row = document.createElement('tr');
        row.setAttribute('id', `${tag.sid}`);

        if (tag.new) {
            row.style.backgroundColor = 'lightblue';
        }

        // Label
        row.appendChild(elem = document.createElement('td'));
        elem.setAttribute('id', 'label')
        elem.innerText = `${tag.label}`;

        // Description
        row.appendChild(elem = document.createElement('td'));
        elem.setAttribute('id', 'description')
        elem.innerText = `${tag.description}`;

        // Goto link
        row.appendChild(elem = document.createElement('td'));
        elem.setAttribute('id', 'goto');
        const elem2 = document.createElement('div');
        elem.appendChild(elem2);
        elem2.style.color = `rgb(${tag.color.r * 255}, ${tag.color.g * 255}, ${tag.color.b * 255})`;

        if (tag.new) {
            // Delete
            row.appendChild(elem = document.createElement('td'));
            elem.setAttribute('id', 'icon');
            elem.appendChild(document.createElement('div'));
        }

        // Insert the new row before the first row of table_container
        if (table_container && table_container.children[0]) {
            table_container.insertBefore(row, table_container.children[0]);
        } else {
            // If no rows exist, simply append the row
            table_container.appendChild(row);
        }

        return row;
    };

    function loadedShowcaseHandler(mpSdk) {
        MPSDK = mpSdk;
        let addingTag = false;
        let movingTag = false;

        // Fetch tags
        mpSdk.Mattertag.getData()
            .then(async (tags) => {
                console.log("tags ::::", tags);

                let toRemove = [];
                if (tags.length > 0) {
                    tags.forEach(element => {
                        toRemove.push(element.sid);
                    });
                }
                mpSdk.Mattertag.remove(toRemove);
                try {
                    const response = await _logic.getTickets(id);
                    let ticketData = [];
                    if (response.length !== 0) {
                        let jsonString = response[0].measurements;
                        jsonString = jsonString.replace(/\\"/g, '"');
                        ticketData = JSON.parse(jsonString);
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
                                tickets = mergeData
                                populateTags(mergeData);
                                setupTagFunctionality();
                            })
                            .then(() => { })
                            .catch((e) => { })
                    }
                } catch (error) {
                    console.error(error);
                }
            })
            .catch(console.error);

        function placeTag() {
            if (tag) mpSdk.Mattertag.navigateToTag(tag, mpSdk.Mattertag.Transition.INSTANT);
            tag = null;
            movingTag = false;
        }

        if (!isFirefox) {
            focusDetect();
        }

        function focusDetect() {
            const eventListener = window.addEventListener('blur', function () {
                if (document.activeElement === iframe) {
                    placeTag(); //function you want to call on click
                    setTimeout(function () { window.focus(); }, 0);
                }
                window.removeEventListener('blur', eventListener);
            });
        }

        function overlayDetect() {
            if (tag) {
                const overlay = document.createElement('div');
                overlay.setAttribute('class', 'click-overlay');
                overlay.addEventListener('mousemove', e => {
                    mpSdk.Renderer.getWorldPositionData({
                        x: e.clientX - 30,
                        y: e.clientY - 5
                    })
                        .then(data => {
                            updateTagPos(data.position);
                        })
                        .catch(e => {
                            console.error(e);
                            placeTag();
                        });

                });
                overlay.addEventListener('click', e => {
                    placeTag();
                    overlay.remove();
                });
                container.insertAdjacentElement('beforeend', overlay);
            }
        }

        function updateTagPos(newPos, newNorm = undefined, scale = undefined) {
            if (!newPos) return;
            if (!scale) scale = .33;
            if (!newNorm) newNorm = { x: 0, y: 1, z: 0 };

            mpSdk.Mattertag.editPosition(tag, {
                anchorPosition: newPos,
                stemVector: {
                    x: scale * newNorm.x,
                    y: scale * newNorm.y,
                    z: scale * newNorm.z,
                }
            })
                .catch(e => {
                    console.error(e);
                    tag = null;
                    movingTag = false;
                });
        }

        mpSdk.Pointer.intersection.subscribe(intersectionData => {
            if (tag && !movingTag) {
                if (intersectionData.object === 'intersectedobject.model' || intersectionData.object === 'intersectedobject.sweep') {
                    updateTagPos(intersectionData.position, intersectionData.normal);
                }
            }
        });

        addTagBtn.addEventListener('click', () => {
            if (!addingTag && !tag) {
                addingTag = true;
                mpSdk.Mattertag.add([{
                    label: "",
                    description: "",
                    anchorPosition: { x: 0, y: 0, z: 0 },
                    stemVector: { x: 0, y: 0, z: 0 },
                    color: { r: 1, g: 0, b: 0 },
                }])
                    .then((sid) => {
                        tag = sid[0];
                        return mpSdk.Mattertag.getData();
                    })
                    .then((collection) => {
                        const t_sid = collection.find(elem => elem.sid === tag);
                        t_sid.new = true;
                        const row = addToTable(t_sid);
                        addTagListeners(row);
                        addingTag = false;
                        setHasChanges(true);
                        tickets = collection
                    })
                    .then(() => {
                        if (isFirefox) overlayDetect();
                    })
                    .catch((e) => {
                        console.error(e);
                        addingTag = false;
                    })
            }
        });

        publishBtn.addEventListener('click', () => {
            mpSdk.Mattertag.getData()
                .then(async (tags) => {
                    console.log("tags::", tags)
                    let ctr = 0;
                    tags.forEach((ticket) => {
                        if (!ticket.description || !ticket.label) {
                            ctr++;
                        }
                    })

                    if (ctr > 0) {
                        enqueueSnackbar(`Please complete all labels and description`, { variant: 'error' });
                        return;
                    }


                    tags.forEach(item => {
                        let status = "Unknown";
                        // Compare the color of the current item with each predefined color
                        for (const [key, value] of Object.entries(colors)) {
                            if (compareColors(item.color, value)) {
                                status = key;
                                break;
                            }
                        }
                        // Add the status field to the current item
                        item.status = status;
                    });

                    console.log("tags::", tags)

                    dispatch(setOverlayState({ active: true, text: "" }))
                    try {
                        const data = {
                            measurements: tags,
                            modelId: id,
                            type: "ticket",
                        }
                        const response = await _logic.saveModelChanges(data);
                        if (response) {
                            setHasChanges(false)
                        }
                    } catch (error) {

                    } finally {
                        dispatch(setOverlayState({ active: false, text: "" }))
                    }
                })
                .catch(console.error);
        });


        selectElement.addEventListener('change', async function (event) {
            const selectedValue = event.target.value;
            try {
                const response = await _logic.getTickets(id);
                let ticketData = [];
                if (response.length !== 0) {
                    let jsonString = response[0].measurements;
                    jsonString = jsonString.replace(/\\"/g, '"');
                    ticketData = JSON.parse(jsonString);
                    if (selectedValue !== "All") {
                        ticketData = ticketData.filter(data => data.status && data.status === selectedValue);
                    }
                    mpSdk.Mattertag.getData()
                        .then(async (tags_to_remove) => {
                            let toRemove2 = [];
                            if (tags_to_remove.length > 0) {
                                tags_to_remove.forEach(element => {
                                    toRemove2.push(element.sid);
                                });
                            }
                            await mpSdk.Mattertag.remove(toRemove2);
                            MPSDK.Mattertag.add(ticketData)
                                .then((sid) => {
                                    return MPSDK.Mattertag.getData();
                                })
                                .then((collection) => {
                                    const mergeData = ticketData.map((val, idx) => {
                                        return {
                                            ...val,
                                            sid: collection[idx].sid
                                        }
                                    });
                                    tickets = mergeData
                                    populateTags(mergeData);
                                    setupTagFunctionality();
                                })
                                .then(() => { })
                                .catch((e) => { })

                        })
                        .catch(console.error);
                }
            } catch (error) {
                console.error(error);
            }


        });


        function updateTag(matTagId, label = null, description = null) {
            if (!label && !description) return;

            // eslint-disable-next-line no-new-object
            const props = new Object();
            // eslint-disable-next-line no-unused-expressions
            label ? props['label'] = label : {};
            // eslint-disable-next-line no-unused-expressions
            description ? props['description'] = description : {};

            mpSdk.Mattertag.editBillboard(matTagId, props)
                .catch((e) => { console.error(e); });
        }



        function changeInfo(ele, tagId) {
            if (ele.tagName === 'TH') { return; }
            const desc = ele.innerText;
            const change = document.createElement('input');
            change.id = tagId;
            change.value = desc;
            ele.replaceWith(change);
            change.focus();
            change.addEventListener('blur', (e) => {
                clickAway(change, tagId);
            });
            change.addEventListener('keydown', (e) => {
                // eslint-disable-next-line eqeqeq
                if (e.key == "Enter") {
                    change.blur();
                }
            });
        }

        function clickAway(ele, tagId) {
            let desc = ele.value;
            const change = document.createElement('td');
            change.id = tagId;
            change.innerText = ele.value;
            ele.replaceWith(change);
            change.removeEventListener('blur', clickAway);
            const lbl = tagId === 'label' ? desc : null;
            const label = lbl;
            desc = tagId === 'description' ? desc : null;
            const description = desc;
            // eslint-disable-next-line no-undef
            updateTag(change.parentElement.id, label, description, tagId);
            change.addEventListener('click', () => {
                changeInfo(change, tagId);
            });
        };

        function addTagListeners(block) {
            if (!block || block.children[0].tagName == 'TH') { return; }
            // Label
            block.children[0].addEventListener('click', () => {
                changeInfo(block.children[0], tag = 'label');
            });

            // Description
            block.children[1].addEventListener('click', () => {
                changeInfo(block.children[1], tag = 'description');
            });

            // arrow icon
            block.children[2].addEventListener('click', () => {
                mpSdk.Mattertag.navigateToTag(block.id, mpSdk.Mattertag.Transition.FADEOUT)
                    .catch((e) => { console.error(e); });
            });
            block.children[2].addEventListener('dblclick', () => {
                mpSdk.Mattertag.getData()
                    .then((tags) => {
                        const filter = tags.find(tag => tag.sid === block.id);
                        setOpenData(filter);
                    })
                    .catch(console.error);
            });

            // delete icon
            if (block.children[3]) {
                block.children[3].addEventListener('click', () => {
                    block.parentNode.removeChild(block);
                    mpSdk.Mattertag.remove(block.id)
                        .catch((e) => { console.log(e); });
                    setHasChanges(1)
                });
            }
        }

        function setupTagFunctionality() {
            document.querySelectorAll('tr').forEach(addTagListeners);
        }

    } // loadedShowcaseHandler
    // ... rest of the functions (unchanged)

    function compareColors(color1, color2) {
        return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
    }

    return (
        <div className="container">
            <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                    <div className="button_container">
                        <Button
                            className="add_tag"

                            style={{ margin: 5 }}
                            size='small'
                            color='error'
                            variant="contained"
                        >
                            <Icon size="small" >add</Icon>
                            Add Ticket
                        </Button>
                        <Button
                            className="publishBtn"
                            style={{ margin: 5 }}
                            size='small'
                            disabled={!hasChanges}
                            color='error'
                            variant="contained"
                        >
                            <Icon size="small" >send</Icon>
                            Publish</Button>
                        <div id="parent_select"> </div>
                    </div>
                    <div className="tag_container">
                        <table className="scrollable1">
                            <thead>
                                <tr>
                                    <th align="left">Label</th>
                                    <th align="left">Description</th>
                                    <th align="left">Action</th>
                                    <th align="left"></th>
                                </tr>
                            </thead>
                        </table>
                        <table className="scrollable">
                            <thead>
                            </thead>
                        </table>
                    </div>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 10 }}>
                    <div className="showcase_container">
                        <iframe title='iframe' className="showcase" frameborder="0" allow="xr-spatial-tracking; fullscreen"
                            style={{
                                boxShadow: `0 4px 8px rgb(43 43 43)`,
                                width: "100%",
                                height: "100%",
                                minHeight: window.innerHeight - (window.innerHeight * .30),
                                maxHeight: window.innerHeight - (window.innerHeight * .30)

                            }}
                        ></iframe>
                    </div>
                </Grid>
            </Grid>
            {openData && <CommentDialog
                handleClose={() => setOpenData(null)}
                data={{ ...openData, refId: id }}
                locationName={locationName}
                projectInfo={projectInfo}
                mpSdk={MPSDK}
                tickets={tickets}
                _setchanges={setHasChanges}
            />}

        </div>
    )
})


export default TicketDetails;
