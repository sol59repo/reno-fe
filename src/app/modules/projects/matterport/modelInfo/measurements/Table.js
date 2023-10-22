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
import Helpers from 'app/utils/Helpers';
import CommentDialog from './CommentDialog.js';


const Table = (props) => {
    const {
        tags,
        mpSdk,
        locationName,
        projectInfo,
        measurements,
        setMeasurements,
        _setchanges
    } = props;

    const _helpers = Helpers();

    const [open, setOpen] = useState(null);
    const [openData, setOpenData] = useState([]);

    const handleClose = (sid) => {
        setOpen(null)
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
        let editedOrientation = measurements.map((value) => {
            if (value.sid === sid) {
                return {
                    ...value,
                    stemVector: stemVector
                }
            } else {
                return value;
            }
        });
        setMeasurements(editedOrientation);
        _setchanges(true)
    }


    const _gotoTag = (sid) => {
        mpSdk.Mattertag.navigateToTag(sid, mpSdk.Mattertag.Transition.FADEOUT)
            .catch((e) => { console.error(e); });
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
                            <IconButton color={"default"} size='small' onClick={(e) => _editTag(e, value)}>
                                <Icon data-edit={"up"}>edit_location</Icon>
                            </IconButton>
                            <IconButton color={"default"} size='small' onClick={() => _gotoTag(value)} >
                                <Icon className="icon">album</Icon>
                            </IconButton>
                        </>

                    )
                }
            }
        },
    ]

    return (
        <Card elevation={6} sx={{ width: '100%', overflow: 'auto' }}>
            <MUIDataTable
                title={'Measurements'}
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
                measurements={measurements}
                setMeasurements={setMeasurements}
                _setchanges={_setchanges}
            />}

        </Card>
    )
}

export default Table
