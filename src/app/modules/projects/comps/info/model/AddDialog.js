import React, { useState, useEffect } from 'react'
import { Box, styled, useTheme } from '@mui/system'
import {
    Dialog,
    Button,
    Icon,
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fab
} from '@mui/material'
import { ValidatorForm, } from 'react-material-ui-form-validator'

import { useSelector } from 'react-redux'
import { Span } from 'app/components/Typography'
import { useDispatch } from 'react-redux'
import { SimpleCard } from 'app/components'
import { H5 } from 'app/components/Typography'
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic'
import CommonLogic from 'app/logic/CommonLogic'


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'space-between'
}))

const AddDialog = ({
    openDialog,
    setOpenDialog,
    matterporIds,
    spaces,
    getSpaces,
    projectId
}) => {
    const dispatch = useDispatch();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();

    const theme = useTheme();
    const { palette } = theme;

    useEffect(() => {

    }, []);


    const isInArray = (spaces, obj) => {
        var i;
        for (i = 0; i < spaces.length; i++) {
            if (spaces[i].spaceId === obj.id) {
                return true;
            }
        }
        return false;
    }

    const filterModels = matterporIds.filter((val) => {
        if (isInArray(spaces, val))
            return false;
        return true;
    });

    const AddToProject = async (spaceId, name) => {
        const data = {
            spaceId: spaceId,
            fkModel: projectId,
            location: name,
            addedBy: _commonLogic.getCount()

        }
        const response = await _logic.AddToProject(data);

        if (response.status) {
            getSpaces();
        }
    }

    const renderModels = (data) => {
        return data.map((val) => {
            return (
                <>
                    <JustifyBox >
                        <H5> {val.name}</H5>
                        <Fab
                            size="small"
                            color="secondary"
                            aria-label="Add"
                            className="button"
                            onClick={() => AddToProject(val.id, val.name)}
                        >
                            <Icon>add</Icon>
                        </Fab>
                    </JustifyBox >
                    <Box py={0.5} />
                </>
            );
        })
    }


    return (
        <>
            <Dialog
                open={openDialog}
                maxWidth="sm"
                fullWidth={true}
                onClose={() => setOpenDialog(false)}
            >
                <SimpleCard title={"Add Matterport Models"}>
                    {renderModels(filterModels)}
                </SimpleCard>
            </Dialog>
        </>
    )
}

export default AddDialog
