import React, { useState, useEffect, useRef } from 'react'
import { Fab, Icon, Tooltip, Button } from '@mui/material'
import { Box, styled } from '@mui/system'
import Table from 'app/modules/projects/matterport/modelInfo/measurements/Table';


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    width: "100%",
    justifyContent: 'space-between',
    padding: 5

}))


const Measurement = props => {
    const {
        childCompRef,
        saveChanges,
        handleChange,
        tags,
        mpSdk,
        isHideMeasurements,
        isHideTags,
        locationName,
        projectInfo,
        measurements,
        setMeasurements,
        hasChanges,
        _setchanges
    } = props


    return (
        <>
            <FlexBox >
                <Button size='small' disabled={!hasChanges} color='error' variant="contained" onClick={saveChanges}>
                    <Icon size="small" >send</Icon>
                    Publish</Button>
            </FlexBox>
            <Table
                tags={tags}
                mpSdk={mpSdk}
                isHideMeasurements={isHideMeasurements}
                isHideTags={isHideTags}
                locationName={locationName}
                projectInfo={projectInfo}
                measurements={measurements}
                setMeasurements={setMeasurements}
                _setchanges={_setchanges}
            />
        </>
    );
};

export default Measurement;