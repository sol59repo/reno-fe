import { format } from 'date-fns'
import { MatxMenu } from 'app/components'
import { getTimeRemaining } from 'utils'
import HtmlReactParser from 'html-react-parser'
import React, { Fragment, useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { Icon, Avatar, Checkbox, MenuItem, IconButton } from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import { H5, Paragraph, Small as Sm, Span } from 'app/components/Typography'
import { Small } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import MeetingLogic from '../logic/MeetingLogic'
import Logic from 'app/modules/staffs/logic/Logic'
import { AlertConfirm, Dialogs } from "../../../commons"
import ConfirmationDialog from "./ConfirmationDialog"
import { useSelector } from 'react-redux'
import Attendees from './Attendees'
import { themeShadows } from 'app/components/MatxTheme/themeColors'
import { useSnackbar } from 'notistack'
import { useNavigate, NavLink } from 'react-router-dom'
import { SITE_URL } from 'app/services/api/constants'

const StyledSpan = styled(Span)(({ bgColor }) => ({
    color: '#fff',
    padding: 3,
    borderRadius: '4px',
    fontSize: 12,
    textTransform: 'capitalize',
    background: bgColor,
}))

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const ContentBox = styled(FlexBox)(() => ({
    flexWrap: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
}))

const StyledH5 = styled(H5)(() => ({
    marginLeft: '4px',
    fontWeight: '500',
}))

const StyledItem = styled(MenuItem)(() => ({
    display: 'flex',
    alignItems: 'center',
    '& .icon': { marginRight: '16px' },
}))

const attendeeModalProps = {
    Title: "",
    size: "xl",
}


const Container = styled('div')(({ theme }) => ({
    width: 220,
    height: 220,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '300px',
    boxShadow: themeShadows[6],
    background: theme.palette.background.default,
    '& span': { fontSize: '4rem' },
}))

const MessageBox = styled('div')(({ theme }) => ({
    height: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
}))


const Meetings = ({ meetingList, handleCheckboxSelection, selectedStatus }) => {
    const navigate = useNavigate();
    const _helpers = Helpers();
    const _logic = MeetingLogic();
    const { enqueueSnackbar } = useSnackbar()
    const _staffLogic = Logic();
    const { staffLists } = useSelector(state => state.staffs)
    const { user } = useSelector(state => state.usercontext)

    console.log('user', user);

    const [expanded, setExpanded] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)

    console.log('meetingLists', meetingList);

    useEffect(() => {
        _staffLogic.getLists({status:"All"})
    }, []);

    const toggleExpansionPanel = (index) => {
        if (index === expanded) setExpanded(false)
        else setExpanded(index)
    }

    const { palette } = useTheme()
    const textMuted = palette.text.secondary

    const startNow = (pmi) => {
        console.log(pmi);

    }

    const _handleUpdate = (meetingId, status) => {
        AlertConfirm({
            callback: () => _confirmUpdateStatus(meetingId, status),
            title: `${status} Meeting?`,
            text: status === "Deleted" ? "You won't be able to revert this!" : "Please Confirm!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }

    const _confirmUpdateStatus = async (meetingId, status) => {
        const response = await _logic.updateStatus({ status: status, meetingId: meetingId });
        if (response) {
            const body = {
                status: selectedStatus
            }
            _logic.getLists(body);
        }
    }


    const _getAttendees = async (id) => {
        const rowData = meetingList.filter((val) => val.ID == id);
        if (rowData.length > 0) {
            setSelectedRow(rowData[0]);
            setShowModal(true);
        }
    }


    const _renderData = () => {
        return meetingList.map((meeting, index) => {
            const { start_time, agenda, id, start_url, join_url, password, pmi } = JSON.parse(meeting.meetingData);
            const _data = JSON.parse(meeting.meetingData);

            console.log('_data', _data);
            return (
                <Accordion
                    key={meeting.ID}
                    expanded={expanded === index}
                    elevation={3}
                >
                    <AccordionSummary sx={{ p: 0, pl: 1, pr: 3 }}>
                        <FlexBox px={1} width="100%">
                            {expanded !== index && (
                                <Fragment>
                                    <Checkbox
                                        checked={meeting.selected}
                                        onChange={(event) =>
                                            handleCheckboxSelection(
                                                event,
                                                index
                                            )
                                        }
                                        color="secondary"
                                    />
                                    <StyledSpan bgColor={_helpers.statusColor(meeting.status)}>
                                        {meeting.status}
                                    </StyledSpan>
                                </Fragment>
                            )}

                            <ContentBox
                                onClick={() => toggleExpansionPanel(index)}
                            >
                                {expanded === index && (
                                    <>
                                        <FlexBox
                                            justifyContent="space-between"
                                            ml="12px"
                                        >
                                            <Avatar src={'assets/images/face-1.jpg'} />
                                            <Box ml={1}>
                                                <StyledH5>
                                                    {meeting.hostEmail}
                                                </StyledH5>
                                                <Sm sx={{ color: textMuted }}>
                                                    {format(
                                                        new Date(
                                                            start_time
                                                        ).getTime(),
                                                        'MMMM dd, yyyy'
                                                    )}
                                                </Sm>

                                            </Box>
                                        </FlexBox>
                                    </>
                                )}

                                {expanded !== index && (
                                    <StyledH5
                                        sx={{
                                            fontSize: '14px',
                                            color: textMuted,
                                        }}
                                    >
                                        {`  ${meeting.ID}`}
                                    </StyledH5>
                                )}

                                <Paragraph>{agenda}</Paragraph>
                                <Sm sx={{ color: textMuted }}>
                                    {getTimeRemaining(new Date(start_time))}{' '}
                                </Sm>
                            </ContentBox>
                            <MatxMenu
                                menuButton={
                                    <IconButton>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                }
                            >
                                {getTimeRemaining(new Date(start_time)) !== "Ended" &&
                                    <>
                                        <StyledItem
                                        // onClick={() => {
                                        //     meeting.status === "Archived" ? enqueueSnackbar(`This meeting was being Archived!`, { variant: 'error' }) : startNow(pmi)
                                        // }}

                                        >
                                            <NavLink
                                                to={`/meeting-room/${pmi}`}
                                                target={"_blank"}
                                            >
                                                <Icon className="icon">call</Icon> Start Now
                                            </NavLink>
                                        </StyledItem>
                                        {meeting.status !== "Completed"
                                            &&
                                            <StyledItem
                                                onClick={() => _handleUpdate(id, meeting.status === "Archived" ? "Pending" : "Archived")}
                                            >
                                                <Icon className="icon">
                                                    {meeting.status === "Archived" ? "check" : "archived"}
                                                </Icon>
                                                {meeting.status === "Archived" ? "Restore" : "Archive"}
                                            </StyledItem>
                                        }
                                    </>
                                }

                                <StyledItem onClick={() => _getAttendees(id)}>
                                    <Icon className="icon">people</Icon>Attendees
                                </StyledItem>

                                <StyledItem onClick={() => _handleUpdate(id, "Deleted")}>
                                    <Icon className="icon">delete_forever</Icon>Delete
                                </StyledItem>
                            </MatxMenu>
                        </FlexBox>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>{HtmlReactParser(JSON.parse(meeting.notes))}</div>
                    </AccordionDetails>
                </Accordion>
            )
        })
    }

    return (
        <>
            <Box mx="4px" mb="4px">

                {meetingList.length > 0 ? _renderData() :
                    <>
                        <MessageBox>
                            <Container>
                                <Icon color="primary">report_problem</Icon>
                            </Container>
                        </MessageBox>
                    </>
                }
            </Box>
            <Dialogs
                {...attendeeModalProps}
                closeModal={() => setShowModal(false)}
                open={showModal}
                Content={() => <Attendees
                    staffLists={staffLists}
                    selectedRow={selectedRow}
                />}
            />
        </>
    )
}

export default Meetings
