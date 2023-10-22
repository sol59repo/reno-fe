import {
    Icon,
    Hidden,
    Checkbox,
    IconButton,
    FormControlLabel,
} from '@mui/material'
import React from 'react'
import { Box } from '@mui/system'
import { styled } from '@mui/system'

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    background: theme.palette.info.main,
}))

const StyledIcon = styled(Icon)(() => ({
    color: '#fff',
}))

const ProjectTopBar = (props) => {
    const { toggleSidenav } = props

    return (
        <Container py="4px" mx="4px">
            <Hidden smUp>
                <IconButton onClick={toggleSidenav}>
                    <StyledIcon>short_text</StyledIcon>
                </IconButton>
            </Hidden>
        </Container>
    )
}

export default ProjectTopBar
