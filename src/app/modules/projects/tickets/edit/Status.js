import React, { useState, useEffect } from 'react'
import {
    Avatar,
    Button,
    Input,
    FormControlLabel,
    Checkbox,
    Tooltip,
} from '@mui/material'
import Scrollbar from 'react-perfect-scrollbar'
import { MatxMenu } from 'app/components'
import { Box, styled, } from '@mui/system'
import { H6, Span } from 'app/components/Typography'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const Heading = styled(H6)(({ theme }) => ({
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
}))

const Status = ({ listStatus, labels, handleChange, bgLightGrey, bgPrimary }) => {
    return (
        <div>
            <Heading sx={{ mb: 1, color: '#42526e' }}>labels</Heading>
            <div className="button-group">
                {labels?.map((label) => (
                    <Button
                        key={label.id}
                        size="small"
                        variant="contained"
                        color={label.color}
                        sx={{
                            mr: '4px',
                            fontSize: '0.8125rem',
                            textTransform: 'capitalize',
                        }}
                    >
                        {label.title}
                    </Button>
                ))}
                <MatxMenu
                    horizontalPosition="right"
                    shouldCloseOnItemClick={false}
                    menuButton={
                        <Tooltip
                            title={'Add'}
                            fontSize="large"
                        >
                            <Button
                                sx={{
                                    background: bgLightGrey,
                                }}
                                size="small"
                            >
                                +
                            </Button>
                        </Tooltip>
                    }
                >
                    {listStatus?.map((label) => (
                        <FormControlLabel
                            sx={{ ml: 0 }}
                            key={label.id}
                            control={
                                <Checkbox
                                    checked={labels.some(
                                        (item) =>
                                            item.id ===
                                            label.id
                                    )}
                                    onChange={handleChange}
                                    value={label.id}
                                    name="label"
                                />
                            }
                            label={
                                <FlexBox>
                                    <Box
                                        sx={{
                                            background:
                                                bgPrimary,
                                            fontSize:
                                                '24px',
                                            borderRadius:
                                                '4px',
                                        }}
                                    />
                                    <Span
                                        sx={{ ml: '12px' }}
                                    >
                                        {label.title}
                                    </Span>
                                </FlexBox>
                            }
                        />
                    ))}
                </MatxMenu>
            </div>
        </div>
    );
};


export default Status;