import React from 'react'
import { styled, useTheme } from '@mui/system'

const BoardLabe = styled('div')(() => ({
    width: '32px',
    height: '6px',
    borderRadius: '6px',
    overflow: 'hidden',
    marginRight: '8px',
}))



const ScrumBoardLabelBar = ({ color = 'primary' }) => {
    const { palette } = useTheme()
    const bgPrimary = palette.primary.main
    const bgSecondary = palette.secondary.main
    const bgSuccess = palette.success.light
    const bgWarning = palette.warning.main
    const bgInfo = palette.info.main
    const bgError = palette.error.main

    const colors = {
        primary: bgPrimary,
        secondary: bgSecondary,
        error: bgError,
        warning: bgWarning,
        info: bgInfo,
        success: bgSuccess,
    }


    return <BoardLabe sx={{ background: colors[color] }} />
}

export default ScrumBoardLabelBar
