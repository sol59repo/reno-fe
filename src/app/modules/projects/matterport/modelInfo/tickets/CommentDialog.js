import React, { useEffect, useState } from 'react';
import {
    Dialog,
    Icon,
    Button,
    Divider,
    IconButton,
    Grid,
    Input,
    useMediaQuery,
} from '@mui/material';

import Scrollbar from 'react-perfect-scrollbar'
import { Box, styled, useTheme } from '@mui/system'
import CommonLogic from 'app/logic/CommonLogic';
import { useSnackbar } from 'notistack'
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic';
import CardMembers from './dialogComps/CardMembers';
import Status from './dialogComps/Status';
import Description from './dialogComps/Description';
import Attachments from './dialogComps/Attachments';
import Activity from './dialogComps/Activity';
import SideButtons from './dialogComps/SideButton';
import Helpers from 'app/utils/Helpers';
import { AlertConfirm } from 'app/commons';


const colors = {
    Pending: { r: 1, g: 0, b: 0 },
    InProgress: { r: 0.9, g: 0.9, b: 0 },
    Completed: { r: 0.0, g: 0.0, b: 1.0 }
}


const StyledInput = styled(Input)(() => ({
    flexGrow: 1,
    fontSize: '16px',
    fontWeight: '500',
    paddingLeft: '3px',
    paddingRight: '8px',
    marginLeft: '12px',
    textTransform: 'capitalize',
}))


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'space-between',
}))


const StyledScrollBar = styled(Scrollbar)(() => ({
    maxHeight: 500,
    position: 'relative',
    paddingTop: '16px',
    marginBottom: '16px',
    background: '#091e420a'
}))


const ContentBox = styled(Box)(({ theme }) => ({
    padding: '0px 24px !important',
    paddingTop: '16px !important',
    [theme.breakpoints.down('sm')]: {
        padding: '0px 12px !important',
    },
}))

function compareColors(color1, color2) {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
}
const CommentDialog = ({
    handleClose,
    data,
    projectInfo,
    mpSdk,
    tickets,
    setTickets,
    _setchanges
}) => {
    const _helpers = Helpers();
    const { fkModel } = projectInfo[0];
    const _commonlogic = CommonLogic();
    const _logic = ProjectLogic();
    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const sid = data?.sid;
    const title = data?.label;
    const refId = data?.refId;
    const desc = data?.description;
    let status = data?.status;

    for (const [key, value] of Object.entries(colors)) {
        if (compareColors(data.color, value)) {
            status = key;
            break;
        }
    }

    const [attachments, setAttachments] = useState([]);
    const [state, setState] = useState({
        labels: [],
        cardMembers: []
    })
    const [comments, setComments] = useState([])
    const [staffs, setStaffs] = useState([])

    const user = {}

    console.log('data', data);

    useEffect(() => {
        const initComments = async () => {
            const response = await _logic.initComments({ refId: refId });
            console.log('response', response);
        }
        initComments();
    }, [])

    useEffect(() => {
        setTimeout(() => {
            if (refId !== undefined) {
                getComments();
            }
        }, 1000)
    }, [])


    const getComments = async () => {
        const Comments = await _logic.getComments(refId);
        const ObjStatus = await _logic.getObjStatus(refId);
        const commentsMembers = await _logic.getcommentsMembers(refId);
        setComments(Comments);
        setState({
            ...state,
            labels: ObjStatus.length > 0 ? JSON.parse(ObjStatus[0].status) : [],
            cardMembers: commentsMembers,
            summary: title,
            description: desc
        })
    }


    const closeDialog = () => {
        handleClose()
    }

    const getColor = (status) => {
        switch (status) {
            case "1":
                return "Pending"
            case "2":
                return "Completed"
            case "3":
                return "InProgress"
            default:
                return "Pending"
        }
    }

    const handleChange = (event) => {
        _setchanges(true) // prevent reload page
        if (event.target.name === 'label') {
            let id = event.target.value
            let label = listStatus.filter((item) => item.id === parseInt(id));
            setState({ ...state, labels: label })
            mpSdk.Mattertag.editColor(sid, _helpers.statusRGB(getColor(id)));
        } else if (event.target.name === 'avatar') {
            let id = event.target.value
            let { cardMembers } = state
            let member = staffs.find((user) => user.ID === id)

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



    // const sendStatus = async (labels) => {
    //     const response = await _logic.sendStatus({ objStatus: labels, refId: refId });
    //     if (response) {
    //         getComments();
    //     }
    // }

    const sendMembers = async (cardMembers, type) => {
        const response = await _logic.sendMembers({ cardMembers: cardMembers, refId: refId, type: type });
        if (response) {
            getComments();
        }
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
            await getComments();
            setState({
                ...state,
                commentText: ''
            })
        }
    }

    let {
        labels,
        commentText,
        cardMembers,

        summary,
        description
    } = state


    useEffect(() => {
        const _getAsignedStaff = async () => {
            const response = await _logic.getAsignedStaff(fkModel);
            setStaffs(response);
        }
        _getAsignedStaff()
    }, []);


    const handleCardArchived = () => {
        AlertConfirm({
            callback: () => _confirmArchived(),
            title: 'Delete Ticket',
            text: "Please confirm!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmArchived = () => {
        const block = document.getElementById(sid);
        block.parentNode.removeChild(block);
        mpSdk.Mattertag.remove(block.id)
            .catch((e) => { console.log(e); });
        enqueueSnackbar(`Ticket successfully removed!`, { variant: 'success' });
        closeDialog()
        _setchanges(true) // prevent reload page
    }


    const handleSave = () => {
        if (summary === "" || description === "" || summary === undefined || description === undefined) {
            enqueueSnackbar(`Please fill out empty fileds!`, { variant: 'error' });
            return;
        }

        mpSdk.Mattertag.editBillboard(sid, {
            label: summary,
            description: description
        })
            .catch((e) => { console.error(e); return; });
        const block = document.getElementById(sid);
        block.children[0].innerText = summary;
        block.children[1].innerText = description;
        enqueueSnackbar(`Updates saved in browser session.`, { variant: 'success' });
        _setchanges(true) // prevent reload page
    }


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
            maxWidth="md"
        >
            <div className="scrum-board">
                <ContentBox>
                    <FlexBox>
                        <FlexBox flexGrow={1}>
                            <Icon sx={{ color: '#42526e' }}>assignment</Icon>
                            <StyledInput
                                type="text"
                                autoFocus
                                name="summary"
                                onChange={handleChange}
                                disableUnderline={true}
                                value={summary}
                                sx={{ fontWeight: 600, fontSize: 25 }}
                            />
                        </FlexBox>
                        <IconButton size="small" onClick={closeDialog}>
                            <Icon>clear</Icon>
                        </IconButton>
                    </FlexBox>

                    <Grid container >
                        <Grid item lg={10} md={10} sm={12} xs={12} sx={{ mt: 0 }}>
                            <Box ml={5}>
                                <JustifyBox mb={2}>

                                    {/* CardMembers */}
                                    <CardMembers
                                        cardMembers={cardMembers}
                                        staffs={staffs}
                                        handleChange={handleChange}
                                    />

                                    {/* Status */}
                                    <Status
                                        listStatus={listStatus}
                                        labels={labels}
                                        handleChange={handleChange}
                                        bgLightGrey={bgLightGrey}
                                        bgPrimary={bgPrimary}
                                        status={status}
                                    />

                                </JustifyBox>
                            </Box>

                            <StyledScrollBar>
                                {/* Description */}
                                <Description
                                    textMuted={textMuted}
                                    description={description}
                                    handleChange={handleChange}

                                />

                                {/* Attachments */}
                                <Attachments
                                    attachments={attachments}
                                    getCardActivities={getComments}
                                />

                                {/* Activity */}

                                <Activity
                                    activities={comments}
                                    sendComment={sendComment}
                                    textMuted={textMuted}
                                    handleChange={handleChange}
                                    commentText={commentText}
                                    user={user}
                                    getCardActivities={getComments}
                                />

                            </StyledScrollBar>
                        </Grid>
                        <Grid item lg={2} md={2} sm={12} xs={12} >
                            <ContentBox style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: "center",
                                flexDirection: 'column',
                            }}>
                                {/* SideButtons */}


                                <SideButtons
                                    staffs={staffs}
                                    getCardActivities={getComments}
                                    cardMembers={cardMembers}
                                    handleChange={handleChange}
                                    listStatus={listStatus}
                                    labels={labels}
                                    handleCardArchived={handleCardArchived}
                                    cardCount={refId}
                                    addedBy={_commonlogic.getId()}
                                />


                            </ContentBox>
                        </Grid>
                    </Grid>
                </ContentBox>

                <Divider></Divider>

                <ContentBox
                    pt={0}
                    mb="12px"
                    display="flex"
                    justifyContent="flex-end"
                >
                    <Button sx={{ mr: '12px' }} onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                </ContentBox>
            </div>
        </Dialog>
    );
}


export default CommentDialog;


const listStatus = [
    {
        id: 1,
        title: 'Pending',
        color: 'error',
    },
    {
        id: 2,
        title: 'Completed',
        color: 'primary',
    },
    {
        id: 3,
        title: 'Inprogress',
        color: 'secondary',
    }
]