import React, { useEffect, useState } from 'react';
import {
    Dialog,
    TextField,
    Icon,
    Avatar,
    Button,
    Divider,
    IconButton,
    FormControlLabel,
    Checkbox,
    Tooltip,
    useMediaQuery,
} from '@mui/material';
import { getTimeDifference } from 'utils.js'

import Scrollbar from 'react-perfect-scrollbar'
import { MatxMenu } from 'app/components'
import { useDispatch, useSelector } from 'react-redux'
import { Box, styled, useTheme } from '@mui/system'
import { H6, H3, Paragraph, Small, Span } from 'app/components/Typography'
import CommonLogic from 'app/logic/CommonLogic';
import { useSnackbar } from 'notistack'
import ProjectLogic from '../../logic/ProjectLogic';

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'space-between',
}))

const StyledAvatar = styled(Avatar)(() => ({
    height: '32px',
    width: '32px',
}))

const Heading = styled(H6)(({ theme }) => ({
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
}))

const StyledScrollBar = styled(Scrollbar)(() => ({
    maxHeight: 380,
    position: 'relative',
    paddingTop: '16px',
    marginBottom: '16px',
}))

const ScrollContent = styled('div')(({ theme }) => ({
    padding: '0px 24px !important',
    paddingTop: '24px !important',
    [theme.breakpoints.down('sm')]: {
        padding: '0px 12px !important',
        paddingTop: '16px !important',
    },
}))

const ContentBox = styled(Box)(({ theme }) => ({
    padding: '0px 24px !important',
    paddingTop: '16px !important',
    [theme.breakpoints.down('sm')]: {
        padding: '0px 12px !important',
    },
}))


const listStatus = [
    {
        id: 1,
        title: 'Pending',
        color: 'primary',
    },
    {
        id: 2,
        title: 'Completed',
        color: 'success',
    },
    {
        id: 3,
        title: 'Inprogress',
        color: 'secondary',
    },
    {
        id: 4,
        title: 'High Priority',
        color: 'error',
    },
]

const projectMembers = [
    {
        id: '1',
        name: 'John Doe',
        avatar: '/assets/images/face-7.jpg',
    },
    {
        id: '323sa680b3249760ea21rt47',
        name: 'Frank Powell',
        avatar: '/assets/images/faces/13.jpg',
    },
    {
        id: '7863a6802ez0e277a0f98534',
        name: 'John Doe',
        avatar: '/assets/images/face-1.jpg',
    },
    {
        id: '14663a3406eb47ffa63d4fec9429cb71',
        name: 'Betty Diaz',
        avatar: '/assets/images/faces/12.jpg',
    }
]

let label;

const CommentDialog = ({ handleClose, data, locationName }) => {
    const _commonlogic = CommonLogic();
    const _logic = ProjectLogic();
    const { enqueueSnackbar } = useSnackbar()
    const dispatch = useDispatch()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const title = data.rowData[0];
    const refId = data.rowData[1].split("||")[0].replace(/\s+/g, '');
    const [state, setState] = useState({
        labels: [],
        cardMembers: []
    })
    const [comments, setComments] = useState([])

    useEffect(async () => {
        const response = await _logic.initComments({ refId: refId });
        console.log('response', response);
    }, [])

    useEffect(() => {
        getComments();
    }, [])


    const getComments = async () => {
        const Comments = await _logic.getComments(refId);
        const ObjStatus = await _logic.getObjStatus(refId);
        const commentsMembers = await _logic.getcommentsMembers(refId);
        setComments(Comments);
        setState({
            ...state,
            labels: JSON.parse(ObjStatus[0].status),
            cardMembers: commentsMembers
        })
    }


    const closeDialog = () => {
        handleClose()
    }

    const handleChange = (event) => {

        if (event.target.name === 'label') {
            let id = event.target.value
            let { labels } = state
            let label = listStatus.find((item) => item.id === parseInt(id))
            if (!event.target.checked) {
                labels.splice(labels.indexOf(label), 1)
                setState({ ...state, labels })
            } else {
                labels.push(label)
                setState({ ...state, labels })
            }

            sendStatus(labels);

        } else if (event.target.name === 'avatar') {
            let id = event.target.value
            let { cardMembers } = state
            let member = projectMembers.find((user) => user.id === id)

            if (!event.target.checked) {
                cardMembers.splice(cardMembers.indexOf(member), 1)
                setState({ ...state, cardMembers })
                sendMembers(member, "Inactive");
            } else {
                cardMembers.push(member)
                sendMembers(member, "Active");
                setState({ ...state, cardMembers })
            }
        } else {
            setState({
                ...state,
                [event.target.name]: event.target.value
            })
        }
    }



    const sendStatus = async (labels) => {
        const response = await _logic.sendStatus({ objStatus: labels, refId: refId });
        if (response) {
            getComments();
        }
    }

    const sendMembers = async (cardMembers, type) => {
        const response = await _logic.sendMembers({ cardMembers: cardMembers, refId: refId, type: type });
        if (response) {
            getComments();
        }
    }


    const displayDescription = (rowData) => {
        let desc = rowData.rowData[1].split("||");
        return desc.length === 3 ? desc[2] : desc[1]

    }

    const sendComment = async () => {
        if (commentText === "" || commentText === undefined) {
            enqueueSnackbar(`Comment area is empty!`, { variant: 'error' });
            return;
        }
        const data = {
            refId: refId,
            comment: commentText,
            addedBy: _commonlogic.getId(),
            dateAdded: new Date().getTime(),
        }
        const response = await _logic.sendComment(data);
        if (response.status) {
            await  getComments();
            setState({
                ...state,
                commentText:  ''
            })
        }
    }

    let {
        labels,
        commentText,
        cardMembers
    } = state


    console.log('commentText', commentText);


    const { palette } = useTheme()
    const textMuted = palette.text.secondary
    const bgPrimary = palette.primary.main
    const bgLightGrey = 'rgba(0, 0, 0, 0.01)'


    return (
        <Dialog
            onClose={closeDialog}
            open={true}
            fullScreen={isMobile}
            fullWidth={true}
            scroll="body"
        >
            <div className="scrum-board">
                <ContentBox>
                    <FlexBox>
                        <FlexBox flexGrow={1}>
                            <Icon sx={{ color: textMuted }}>assignment</Icon>
                            <H3>{title}</H3>
                        </FlexBox>
                        <IconButton size="small" onClick={closeDialog}>
                            <Icon>clear</Icon>
                        </IconButton>
                    </FlexBox>

                    <Box ml={5}>
                        <Paragraph
                            sx={{ mb: 2, fontSize: '0.8125rem', color: textMuted }}>
                            {locationName.location}
                        </Paragraph>

                        <JustifyBox mb={2}>
                            <div>
                                <Heading sx={{ mb: 1 }}>Projects Members</Heading>
                                <Box
                                    ml="-0.875rem"
                                    display="flex"
                                    position="relative"
                                >
                                    {cardMembers.map((member) => (
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
                                        {projectMembers.map((user) => (
                                            <FormControlLabel
                                                sx={{ ml: 0 }}
                                                key={user.id}
                                                control={
                                                    <Checkbox
                                                        name="avatar"
                                                        checked={cardMembers.some(
                                                            (member) =>
                                                                member.userID ===
                                                                user.id
                                                        )}
                                                        onChange={handleChange}
                                                        value={user.id}
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
                                                            {user.name}
                                                        </Span>
                                                    </FlexBox>
                                                }
                                            />
                                        ))}
                                    </MatxMenu>
                                </Box>
                            </div>
                            <div>
                                <Heading sx={{ mb: 1 }}>Status</Heading>
                                <div className="button-group">
                                    {labels.map((status) => (
                                        <Button
                                            key={status.id}
                                            size="small"
                                            variant="contained"
                                            color={status.color}
                                            sx={{
                                                mr: '4px',
                                                color: '#fff',
                                                fontSize: '0.8125rem',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {status.title}
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
                                        {listStatus.map((label) => (
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
                        </JustifyBox>
                    </Box>
                </ContentBox>

                <Divider></Divider>

                <StyledScrollBar>
                    <ScrollContent>
                        <FlexBox mb={1}>
                            <Icon sx={{ color: textMuted }}>description</Icon>
                            <Heading sx={{ ml: 2 }}>description</Heading>
                        </FlexBox>
                        <Box ml={5} mb={2} display="flex">
                            <Paragraph
                                sx={{
                                    mb: 2,
                                    fontSize: '0.8125rem',
                                    color: textMuted,
                                }}
                            >
                                {displayDescription(data)}
                            </Paragraph>
                        </Box>
                    </ScrollContent>

                    <Divider sx={{ my: 2 }} />

                    <ContentBox pt={0}>
                        <FlexBox mb={1}>
                            <Icon sx={{ color: textMuted }}>message</Icon>
                            <Heading sx={{ ml: 2 }}>comments</Heading>
                        </FlexBox>
                        <Box ml={5} className="comments">
                            <Box mb={2}>
                                {comments?.map(value => (
                                    <div key={value.count}>
                                        <FlexBox mb={1}>
                                            <StyledAvatar
                                                src={value.profile}
                                                sizes={'36'}
                                            />
                                            <Box ml="12px">
                                                <H6>{value.firstname + ' ' + value.lastname}</H6>
                                                <small>
                                                    {getTimeDifference(
                                                        new Date(parseFloat(value.dateAdded))
                                                    )}{' '}
                                                    ago
                                                </small>
                                            </Box>
                                        </FlexBox>
                                        <Paragraph sx={{ color: textMuted }}>
                                            {value.comment}
                                        </Paragraph>
                                    </div>
                                ))

                                }
                            </Box>

                            <FlexBox mb={2}>
                                <StyledAvatar src={'user.photoURL'} sizes={'36'} />
                                <Box display="flex" flexGrow={1}>
                                    <TextField
                                        onChange={handleChange}
                                        variant="outlined"
                                        name="commentText"
                                        value={commentText || ''}
                                        fullWidth
                                        inputProps={{
                                            style: {
                                                padding: '10px',
                                            },
                                        }}
                                        sx={{ m: '12px', color: textMuted }}
                                    />
                                </Box>
                                <Button onClick={sendComment}>Send</Button>
                            </FlexBox>
                        </Box>
                    </ContentBox>
                </StyledScrollBar>

                <ContentBox
                    pt={0}
                    mb="12px"
                    display="flex"
                    justifyContent="flex-end"
                >
                    <Button sx={{ mr: '12px' }} onClick={closeDialog}>
                        Cancel
                    </Button>
                </ContentBox>
            </div>
        </Dialog>
    );
}


export default CommentDialog;