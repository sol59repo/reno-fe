import React, { useState, useEffect } from 'react'
import {
    TextField,
    Icon,
} from '@mui/material'
import { Box, styled } from '@mui/system'
import { H6, } from 'app/components/Typography'


const Heading = styled(H6)(({ theme }) => ({
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
}))


const ScrollContent = styled('div')(({ theme }) => ({
    padding: '0px 24px !important',
    paddingTop: '24px !important',
    [theme.breakpoints.down('sm')]: {
        padding: '0px 12px !important',
        paddingTop: '16px !important',
    },
}))


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))


const Description = ({ description, textMuted, handleChange }) => {
    return (
        <ScrollContent>
            <FlexBox mb={1}>
                <Icon sx={{ color: '#42526e' }}>description</Icon>
                <Heading sx={{ ml: 2, color: '#42526e' }}>Description</Heading>
            </FlexBox>
            <Box ml={5} mb={2} display="flex">
                <TextField
                    sx={{ color: textMuted }}
                    onChange={handleChange}
                    name="description"
                    value={description || ""}
                    variant="outlined"
                    fullWidth
                    multiline
                />
            </Box>

        </ScrollContent>
    );
};


export default Description;