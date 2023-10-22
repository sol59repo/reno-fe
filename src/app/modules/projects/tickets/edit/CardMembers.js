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
import { H6,  Span } from 'app/components/Typography'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const Heading = styled(H6)(({ theme }) => ({
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
}))

const StyledAvatar = styled(Avatar)(() => ({
    height: '32px',
    width: '32px',
}))


const CardMembers = ({cardMembers,staffs,handleChange}) => {
    return (
        <div>
            <Heading sx={{ mb: 1, color: '#42526e' }}>Card Members</Heading>
            <Box
                ml="-0.875rem"
                display="flex"
                position="relative"
            >
                {cardMembers?.map((member) => (
                    <StyledAvatar
                        key={member.userID}
                        src={member.avatar}
                    />
                ))}
                <MatxMenu
                    horizontalPosition="center"
                    shouldCloseOnItemClick={false}
                    menuButton={
                        <Tooltip
                            title={'Add'}
                            fontSize="large"
                        >
                            <StyledAvatar
                                sx={{
                                    ml: '-12px',
                                    cursor: 'pointer',
                                }}
                            >
                                +
                            </StyledAvatar>
                        </Tooltip>
                    }
                >
                    {staffs?.map((user) => (
                        <FormControlLabel
                            sx={{ ml: 0 }}
                            key={user.ID}
                            control={
                                <Checkbox
                                    name="avatar"
                                    checked={cardMembers.some(
                                        (member) =>
                                            member.userID ===
                                            user.ID
                                    )}
                                    onChange={handleChange}
                                    value={user.ID}
                                />
                            }
                            label={
                                <FlexBox>
                                    <Avatar
                                        src={user.avatar}
                                        sizes={'24'}
                                    />
                                    <Span
                                        sx={{ ml: '12px' }}
                                    >
                                        {user.empName}
                                    </Span>
                                </FlexBox>
                            }
                        />
                    ))}
                </MatxMenu>
            </Box>
        </div>
    );
};


export default CardMembers;