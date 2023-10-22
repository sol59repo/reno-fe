import React, { useState, useEffect } from 'react'
import {
    Avatar,
    Button,
    Input,
    FormControlLabel,
    Checkbox,
    Tooltip,
    Radio
} from '@mui/material'
import Scrollbar from 'react-perfect-scrollbar'
import { MatxMenu } from 'app/components'
import { Box, styled, } from '@mui/system'
import { H6, Span } from 'app/components/Typography'
import Helpers from 'app/utils/Helpers'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const Heading = styled(H6)(({ theme }) => ({
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
}))

const Status = ({ listStatus, labels, handleChange, bgLightGrey, bgPrimary, status }) => {

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
        <div>
            <Heading sx={{ mb: 1, color: '#42526e' }}>labels</Heading>
            <div className="button-group">
                <Button
                    size="small"
                    variant="contained"
                    color={getColor(status)}
                    sx={{
                        mr: '4px',
                        fontSize: '0.8125rem',
                        textTransform: 'capitalize',
                    }}
                >
                    {status}
                </Button>
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
                                <Radio
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