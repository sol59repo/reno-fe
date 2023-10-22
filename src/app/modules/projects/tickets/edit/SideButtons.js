import * as React from 'react';
import { Box, useTheme } from '@mui/system'
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Archive from '@mui/icons-material/Archive';
import People from '@mui/icons-material/People';
import Attachment from '@mui/icons-material/Attachment';
import Bookmarks from '@mui/icons-material/Bookmarks';
import { Span } from 'app/components/Typography'
import { MatxMenu } from 'app/components'
import ProjectLogic from '../../logic/ProjectLogic';

import {
    Checkbox,
    Avatar,
    FormControlLabel,
    Icon
} from '@mui/material'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))


const FireNav = styled(List)({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
});


const HiddenInput = styled('input')(() => ({
    display: 'none',
}))


const FabIcon = styled(Fab)(() => ({
    textTransform: 'capitalize',
    '& .icon': { marginRight: '8px' },
}))

export default function SideButtons({
    staffs,
    cardMembers,
    handleChange,
    listStatus,
    labels,
    handleCardArchived,
    cardCount,
    addedBy,
    getCardActivities
}) {

    const _logic = ProjectLogic();
    const { palette } = useTheme()
    const bgPrimary = palette.primary.main

    const handleFileSelect = async (event) => {
        const file = event.target.files[0]
        const body = new FormData();
        body.append('file', file);
        body.append('fkCard', cardCount);
        body.append('addedBy', addedBy);
        const response = await _logic.uploadFile(body);
        if (response.status) {
            getCardActivities();
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Paper elevation={0} sx={{ maxWidth: 256 }}>
                <FireNav component="nav" disablePadding>
                    <Box sx={{ pb: 0, ml: 2 }} >
                        <ListItemButton
                            alignItems="flex-start"
                            sx={{ px: 3, pt: 2.5, pb: 1 }}
                        >
                            <ListItemText
                                primary="Add to card"
                                primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight: 'medium',
                                    lineHeight: '10px',
                                    mb: '2px',
                                }}

                                secondaryTypographyProps={{
                                    noWrap: true,
                                    fontSize: 12,
                                    lineHeight: '16px',
                                    color: 'rgba(0,0,0,0)'
                                }}
                                sx={{ my: 0 }}
                            />
                        </ListItemButton>

                        <MatxMenu
                            horizontalPosition="center"
                            shouldCloseOnItemClick={false}
                            menuButton={
                                <Tooltip
                                    title={'Add Members'}
                                    fontSize="large"
                                >
                                    <ListItemButton
                                        sx={{
                                            py: 0,
                                            minHeight: 32,
                                            color: '#42526e',
                                            background: "#091e420a",
                                            maxWidth: 150,
                                            minWidth: 150
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit' }}>
                                            <People />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={'Members'}
                                            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                        />
                                    </ListItemButton>
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


                        <MatxMenu
                            horizontalPosition="right"
                            shouldCloseOnItemClick={false}
                            menuButton={
                                <Tooltip
                                    title={'Add Status'}
                                    fontSize="large"
                                >
                                    <ListItemButton
                                        sx={{
                                            py: 0,
                                            minHeight: 32,
                                            color: '#42526e',
                                            background: "#091e420a",
                                            marginTop: 1,
                                            maxWidth: 150,
                                            minWidth: 150
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit' }}>
                                            <Bookmarks />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={'Status'}
                                            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                        />
                                    </ListItemButton>
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

                        <label htmlFor="upload-single-file">
                            <ListItemButton
                                sx={{
                                    py: 0,
                                    minHeight: 32,
                                    color: '#42526e',
                                    background: "#091e420a",
                                    marginTop: 1,
                                    marginBottom: 1,
                                    maxWidth: 150,
                                    minWidth: 150
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                    <Attachment />
                                </ListItemIcon>
                                <ListItemText
                                    primary={'Attachments'}
                                    primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                />
                            </ListItemButton>
                        </label>
                        <HiddenInput
                            onChange={handleFileSelect}
                            id="upload-single-file"
                            type="file"
                        />


                        <ListItemButton
                            alignItems="flex-start"
                            sx={{ px: 3, pt: 3.5, pb: 1 }}
                        >
                            <ListItemText
                                primary="Actions"
                                primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight: 'medium',
                                    lineHeight: '10px',
                                    mb: '2px',
                                }}

                                secondaryTypographyProps={{
                                    noWrap: true,
                                    fontSize: 12,
                                    lineHeight: '16px',
                                    color: 'rgba(0,0,0,0)'
                                }}
                                sx={{ my: 0 }}
                            />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                py: 0,
                                minHeight: 32,
                                color: '#42526e',
                                background: "#091e420a",
                                marginTop: 1,
                                maxWidth: 150,
                                minWidth: 150
                            }}

                            onClick={handleCardArchived}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                <Archive />
                            </ListItemIcon>
                            <ListItemText
                                primary={'Archived'}
                                primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                            />
                        </ListItemButton>

                    </Box>
                </FireNav>
            </Paper>
        </Box>
    );
}
