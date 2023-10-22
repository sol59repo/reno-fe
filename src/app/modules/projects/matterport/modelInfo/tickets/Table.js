import React, { useState, useEffect, useRef } from 'react'
import {
    Card,
    Icon,
    IconButton
} from '@mui/material'
import { MatxMenu } from 'app/components'
import { StyledItem } from 'app/commons/StyledEl';
import { Box, styled } from '@mui/system';
import MUIDataTable from 'mui-datatables'
import CommentDialog from './CommentDialog';
import Helpers from 'app/utils/Helpers';


const Table = (props) => {
    const {
        tags,
        mpSdk,
        isHideMeasurements,
        isHideTags,
        locationName,
        projectInfo,
        tickets,
        setTickets,
        _setchanges
    } = props;

    const _helpers = Helpers();

    const [open, setOpen] = useState(null);
    const [openData, setOpenData] = useState([]);

    const handleClose = (sid) => {
        setOpen(null)
    }


    const handleEyeIcon = (description) => {
        if (description.indexOf("Measurement:") < 0) {
            if (!isHideTags) {
                return "error";

            } else {
                return "";
            }
        } else {
            if (!isHideMeasurements) {
                return "error";

            } else {
                return "";
            }
        }
    }

    const _editTag = (td, sid) => {
        const target = td.target;
        const editType = td.target.getAttribute("data-edit");
        var stemVector;
        if (editType === "up") {
            target.setAttribute("data-edit", 'north');
            stemVector = { x: 0, y: 0.30, z: 0 }
            _editPosition(sid, stemVector, mpSdk);
        } else if (editType === "north") {
            target.setAttribute("data-edit", 'south');
            stemVector = { x: 0.3, y: 0, z: 0 }
            _editPosition(sid, stemVector, mpSdk);
        } else if (editType === "south") {
            target.setAttribute("data-edit", 'west');
            stemVector = { x: 0.0, y: 0.3, z: 0 }
            _editPosition(sid, stemVector, mpSdk);
        } else if (editType === "west") {
            target.setAttribute("data-edit", 'east');
            stemVector = { x: -0.329, y: 0.0041, z: 0.0023 }
            _editPosition(sid, stemVector, mpSdk);
        } else if (editType === "east") {
            target.setAttribute("data-edit", 'up');
            stemVector = { x: 0, y: 0, z: 0.3 }
            _editPosition(sid, stemVector, mpSdk);
        }
    }


    const _editPosition = (sid, stemVector, mpSdk) => {
        mpSdk.Mattertag.editPosition(sid, { stemVector: stemVector })
        let editedOrientation = tickets.map((value) => {
            if (value.sid === sid) {
                return {
                    ...value,
                    stemVector: stemVector
                }
            } else {
                return value;
            }
        });
        // setTags(editedOrientation);

    }

    const _hideTag = (td, sid) => {
        const target = td.target;
        const hideType = td.target.getAttribute("data-remove");
        if (hideType === "show") {
            target.setAttribute("data-remove", "hide");
            target.classList.add('css-9kxedx');
            mpSdk.Mattertag.editOpacity(sid, 0);

        } else {
            target.setAttribute("data-remove", "show");
            target.classList.remove('css-9kxedx');
            mpSdk.Mattertag.editOpacity(sid, 1);
        }
    }

    const _editLabel = (td, tableMeta, type) => {
        const sid = tableMeta.rowData[2];
        const target = td.target;
        const label = target.innerText;
        const change = document.createElement('input');
        change.id = sid;
        change.value = label;
        target.replaceWith(change);
        change.focus();
        change.addEventListener('blur', (e) => {
            clickAway(change, sid, mpSdk, type);
        });
        change.addEventListener('keydown', (e) => {
            if (e.key == "Enter") {
                change.blur();
            }
        });
    }

    const clickAway = (ele, tagId, sdk, type) => {

        let label = ele.value;
        const change = document.createElement('td');
        change.id = tagId;
        change.innerText = ele.value;
        change.classList.add("MuiTableCell-root");
        change.classList.add("MuiTableCell-body");
        change.classList.add("MuiTableCell-sizeMedium");
        change.classList.add("MuiTableCell-alignCenter");
        change.classList.add("css-598x4u");
        ele.replaceWith(change);
        change.removeEventListener('blur', clickAway);

        updateTag(tagId, label, sdk, type);
        change.addEventListener('click', () => {
            changeInfo(change, tagId, sdk, type);
        });
    }


    const changeInfo = (ele, tagId, sdk, type) => {
        const desc = ele.innerText;
        const change = document.createElement('input');
        change.id = tagId;
        change.value = desc;
        ele.replaceWith(change);
        change.focus();
        change.addEventListener('blur', (e) => {
            clickAway(change, tagId, sdk, type);
        });
        change.addEventListener('keydown', (e) => {
            if (e.key == "Enter") {
                change.blur();
            }
        });
    }

    const updateTag = (matTagId, label = null, mpSdk, type) => {
        if (!label) return;
        const props = new Object();
        props[type] = label
        let edited = tags.map((value) => {
            if (value.sid === matTagId) {
                return {
                    ...value,
                    [type]: props[type]
                };
            } else {
                return value;
            }
        });


        // setTags(edited);
        mpSdk.Mattertag.editBillboard(matTagId, props)
            .catch((e) => { console.error(e); });
    }


    const _gotoTag = (sid) => {
        mpSdk.Mattertag.navigateToTag(sid, mpSdk.Mattertag.Transition.FADEOUT)
            .catch((e) => { console.error(e); });
    }

    const _removeTag = (sid) => {
        const newTags = tags.filter(value => value.sid !== sid);
        // setTags(newTags);

        mpSdk.Mattertag.remove(sid)
            .catch((e) => { console.log(e); });
    }


    const columns = [
        {
            name: 'label', // field name in the row object
            label: 'Label', // column title that will be shown in table
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta
                    const label = tags[rowIndex]?.label
                    return (
                        <div>
                            {label || ""}
                        </div>
                    )
                }
            },
        },
        {
            name: 'description',
            label: 'Description',
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta
                    const description = tags[rowIndex]?.description
                    return (
                        <div>
                            {description || ""}
                        </div>
                    )
                }
            },
        },
        {
            name: 'sid',
            label: 'Action',
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta
                    const { refId, status } = tags[rowIndex]

                    return (
                        <>
                            {/* <IconButton size='small' onClick={(e) => _hideTag(e, value)} >
                                <Icon
                                    color={handleEyeIcon(getDescription(value))}
                                    data-remove={"show"}>
                                    remove_red_eye
                                </Icon>
                            </IconButton> */}
                            {/* <IconButton color={getColor(status)} size='small' onClick={(e) => _editTag(e, value)}>
                                <Icon data-edit={"up"}>edit_location</Icon>
                            </IconButton> */}
                            <IconButton color={getColor(status)} size='small' onClick={() => _gotoTag(value)} >
                                <Icon className="icon">album</Icon>
                            </IconButton>
                        </>

                    )
                }
            }
        },
    ]

    const getColor = (status) => {
        switch (status) {
            case "Pending":
                return "error"
                break;
            case "InProgress":
                return "secondary"
                break;
            default:
                return "primary"
        }
    }


    return (
        <Card elevation={6} sx={{ width: '100%', overflow: 'auto' }}>
            <MUIDataTable
                title={'Ticket Information'}
                data={tags}
                columns={columns}
                options={{
                    download: false,
                    print: false,
                    viewColumns: false,
                    search: true, // set search option
                    filter: false, // set data filter option
                    pagination: true, //set pagination option
                    elevation: 0,
                    selectableRows: "none",
                    rowsPerPageOptions: [10, 20, 40, 80, 100],
                    setTableProps: () => ({
                        padding: "small",
                        size: "small"
                    }),
                    setRowProps: (row, dataIndex) => ({
                        onDoubleClick: (evt) => {
                            const refId = tags[dataIndex]?.refId
                            const rowData = tags[dataIndex]
                            setOpen(refId)
                            setOpenData(rowData)
                        }
                    }),
                }}
            />


            {open !== null && <CommentDialog
                handleClose={handleClose}
                data={openData}
                locationName={locationName}
                projectInfo={projectInfo}
                mpSdk={mpSdk}
                tickets={tickets}
                setTickets={setTickets}
                _setchanges={_setchanges}
            />}

        </Card>
    )
}

export default Table
