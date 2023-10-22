import React, { useState, useEffect, useRef } from 'react'
import { Fab, Icon, Tooltip, Button } from '@mui/material'
import { Box, styled } from '@mui/system'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Table from 'app/modules/projects/matterport/modelInfo/tickets/Table';


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    width: "100%",
    justifyContent: 'space-between',
    padding: 5

}))


const Ticket = props => {
    const {
        childCompRef,
        saveChanges,
        handleChange,
        tags,
        mpSdk,
        isHideMeasurements,
        isHideTags,
        locationName,
        status,
        projectInfo,
        tickets,
        setTickets,
        hasChanges,
        _setchanges
    } = props




    return (
        <>
            <FlexBox >
                <Box>

                    <Button
                        style={{ margin: 5 }}
                        size='small'
                        color='error'
                        variant="contained"
                        onClick={() => childCompRef.current._addNewTag(mpSdk)}>
                        <Icon size="small" >add</Icon>
                        Add Ticket
                    </Button>



                    <Button
                        style={{ margin: 5 }}
                        size='small'
                        disabled={!hasChanges}
                        color='error'
                        variant="contained"
                        onClick={saveChanges}>
                        <Icon size="small" >send</Icon>
                        Publish</Button>

                </Box>

                <Box sx={{ minWidth: 220 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            label="status"
                            onChange={handleChange}
                        >
                            <MenuItem value={"All"}>All</MenuItem>
                            <MenuItem value={"InProgress"}>In-progress</MenuItem>
                            <MenuItem value={"Completed"}>Completed</MenuItem>
                            <MenuItem value={"Pending"}>Pending</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </FlexBox>
            <Table
                tags={tags}
                mpSdk={mpSdk}
                isHideMeasurements={isHideMeasurements}
                isHideTags={isHideTags}
                locationName={locationName}
                projectInfo={projectInfo}
                tickets={tickets}
                setTickets={setTickets}
                _setchanges={_setchanges}
            />
        </>
    );
};

export default Ticket;