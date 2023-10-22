import React, { useState, useEffect, useRef } from 'react'
import {
    Table,
    Card,
    Icon,
    IconButton
} from '@mui/material'
import { MatxMenu } from 'app/components'
import { StyledItem } from 'app/commons/StyledEl';
import { Box, styled } from '@mui/system';
import MUIDataTable from 'mui-datatables'
import CommentDialog from './comments/CommentDialog';
const Description = (props) => {
    const { tags, mpSdk, setTags, isHideMeasurements, isHideTags, locationName } = props;


    const [open, setOpen] = useState(null);

    const getDescription = (sid) => {
        const desc = tags.filter((val) => val.sid === sid);
        return desc[0].description;
    }

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
        let editedOrientation = tags.map((value) => {
            if (value.sid === sid) {
                return {
                    ...value,
                    stemVector: stemVector
                }
            } else {
                return value;
            }
        });
        setTags(editedOrientation);
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


        setTags(edited);
        mpSdk.Mattertag.editBillboard(matTagId, props)
            .catch((e) => { console.error(e); });
    }


    const _gotoTag = (sid) => {
        mpSdk.Mattertag.navigateToTag(sid, mpSdk.Mattertag.Transition.FADEOUT)
            .catch((e) => { console.error(e); });
    }

    const _removeTag = (sid) => {
        const newTags = tags.filter(value => value.sid !== sid);
        setTags(newTags);

        mpSdk.Mattertag.remove(sid)
            .catch((e) => { console.log(e); });
    }


    const displayDescription = (value, tableMeta) => {
        let desc = value.split("||")
        return (
            <div onClick={(e) => value.indexOf("Measurement:") < 0 ? _editLabel(e, tableMeta, "description") : null}>
                {desc.length === 3 ? desc[2] : desc[1]}
            </div>
        );
    }


    const columns = [
        {
            name: 'label', // field name in the row object
            label: 'Label', // column title that will be shown in table
            options: {
                filter: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div onClick={(e) => _editLabel(e, tableMeta, "label")}>
                            {value}
                        </div>
                    )
                }
            },
        },
        {
            name: 'description',
            label: 'Description',
            options: {
                filter: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return displayDescription(value, tableMeta);
                }
            },
        },
        {
            name: 'sid',
            label: 'Action',
            options: {
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const refId = tableMeta.rowData[1].split("||")[0].replace(/\s+/g, '');
                    const { rowIndex } = tableMeta;
                    const data = tags[rowIndex]

                    console.log('rowIndex', rowIndex);
                    console.log('data', data);
                    console.log('refId', refId);

                    return (
                        <>
                            <MatxMenu
                                menuButton={
                                    <IconButton>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                }
                            >
                                <StyledItem size='small' onClick={(e) => _removeTag(value)} >
                                    <Icon className="icon">delete_forever</Icon>
                                </StyledItem>
                                <StyledItem size='small' onClick={() => _gotoTag(value)} >
                                    <Icon className="icon">call_made</Icon>
                                </StyledItem>
                                <StyledItem size='small' onClick={() => setOpen(refId)} >
                                    <Icon className="icon">message</Icon>
                                </StyledItem>
                            </MatxMenu>
                            <IconButton size='small' onClick={(e) => _hideTag(e, value)} >
                                <Icon
                                    color={handleEyeIcon(getDescription(value))}
                                    data-remove={"show"}>
                                    remove_red_eye
                                </Icon>
                            </IconButton>
                            <IconButton size='small' onClick={(e) => _editTag(e, value)}>
                                <Icon data-edit={"up"}>edit</Icon>
                            </IconButton>


                            {open === refId && <CommentDialog
                                handleClose={handleClose}
                                data={tableMeta}
                                locationName={locationName}
                            />}

                        </>

                    )
                }
            }
        },
    ]


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
                        padding: "normal",
                        size: "small"
                    })
                }}
            />



        </Card>
    )
}

export default Description
