import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import React, {
    useState,
    useEffect,
    useRef,
    Children,
    cloneElement,
} from "react";
import { Button, Snackbar, Icon, SnackbarContent } from "@mui/material";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import CalendarHeader from "./CalendarHeader";
import * as ReactDOM from "react-dom";
import EventEditorDialog from "./EventEditorDialog";
import { Box, styled } from "@mui/system";
import moment from "moment";
import { convertHexToRGB } from "utils";
import Breadcrumb from "app/components/Breadcrumb/Breadcrumb";
import CalendarLogic from "../logic/CalendarLogic";
import CommonLogic from "app/logic/CommonLogic";
import { useNavigate } from "react-router-dom";
import ViewEvent from "./ViewEvent";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/system";
import { isMobile } from "react-device-detect";

const Small = styled("small")(({ bgcolor }) => ({
    height: 25,
    width: 70,
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "2px",
    overflow: "hidden",
    background: bgcolor,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
    textAlign: "center",
    opacity: bgcolor === "#FF3D57" ? "0.6" : "1",
}));

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: {
        margin: "16px",
    },
    "& .breadcrumb": {
        margin: "30px",
        [theme.breakpoints.down("sm")]: {
            margin: "16px",
        },
    },
}));

const SnackbarRoot = styled("div")(({ theme }) => ({
    width: "100%",
    "& .snackbar": {
        margin: theme.spacing(1),
    },
}));

const FlexBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
}));

const CalendarRoot = styled("div")(({ theme }) => ({
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    "& .rbc-event": {
        background: `rgba(${convertHexToRGB(theme.palette.primary.main)},1)`,
    },
    "& .rbc-selected": {
        background: `rgba(${convertHexToRGB(theme.palette.secondary.main)},1)`,
    },
    "& .rbc-calendar": {
        height: "auto",
        flexGrow: 1,
    },
    "& .rbc-header": {
        padding: "12px 16px !important",
        "& a": {
            paddingBottom: "8px !important",
        },
        "& span": {
            fontSize: "15px !important",
            fontWeight: 500,
        },
    },
}));

// const TouchCellWrapper = ({ children, value, onSelectSlot }) =>
//     cloneElement(Children.only(children), {
//         onTouchEnd: () => onSelectSlot({ action: "click", slots: [value] }),
//         style: {
//             className: `${children}`
//         }
//     });

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
let viewList = Object.keys(Views).map((key) => Views[key]);

const MatxCalendar = () => {
    const { palette } = useTheme();
    const _logic = CalendarLogic();
    const _commonLogic = CommonLogic();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [meetings, setMeetings] = useState([]);
    const [managers, setManagers] = useState([]);
    const [ZoomLink, setZoomLink] = useState("");
    const [newEvent, setNewEvent] = useState(null);
    const [shouldShowEventDialog, setShouldShowEventDialog] = useState(false);
    const headerComponentRef = useRef(null);

    const [showViewEbeDialog, setShowViewEbeDialog] = useState(false);
    const [eventData, setEventData] = useState({});
    const [attendees, setAttendees] = useState({});

    const bgError = palette.error.main;
    const bgSuccess = palette.success.main;
    const bgInfo = palette.primary.main;
    const grey = palette.grey["dark"];

    useEffect(() => {
        const getMeetings = async () => {
            const response = await _logic.getMeetings(_commonLogic.getCount());
            const events = response?.map((e) => ({
                ...e,
                start: new Date(e.schedule),
                end: new Date(e.schedule),
            }));

            console.log("getMeetings", events);
            setMeetings(events);
        };

        const getManagers = async () => {
            const response = await _logic.getManagers();
            if (response.length > 0) {
                const _filteruserLoggedIn = response.filter(
                    (val) => val.count !== _commonLogic.getCount()
                );
                setManagers(_filteruserLoggedIn);
            } else {
                setManagers(response);
            }
            console.log("getManagers", response);
        };

        const getZoomLink = async () => {
            const response = await _logic.getZoomLink(_commonLogic.getCount());
            setZoomLink(response[0]?.zoomLink || "");
            console.log("getZoomLink", response);
        };

        getMeetings();
        getManagers();
        getZoomLink();
    }, []);

    const getMeetings = async () => {
        const response = await _logic.getMeetings(_commonLogic.getCount());
        const events = response?.map((e) => ({
            ...e,
            start: new Date(e.schedule),
            end: new Date(e.schedule),
        }));
        setMeetings(events);
    };

    const getMeetingAttendee = async (meetingCount) => {
        const attendees = await _logic.getMeetingAttendee(meetingCount);
        setAttendees(attendees);
    };

    const updateCalendar = async () => {
        const response = await _logic.getMeetings(_commonLogic.getCount());
        const events = response?.map((e) => ({
            ...e,
            start: new Date(e.schedule),
            end: new Date(e.schedule),
        }));

        setMeetings(events);
    };

    const handleDialogClose = () => {
        setShouldShowEventDialog(false);
        updateCalendar();
    };

    const handleViewEventClose = (event) => {
        setShowViewEbeDialog(false);
        setEventData({});
    };

    const handleEventMove = (event) => {
        handleEventResize(event);
    };

    const handleEventResize = (event) => {
        updateCalendar();
    };

    const isInThePast = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return date < today;
    };

    const openNewEventDialog = ({ action, ...event }) => {
        console.log("action", action);
        console.log("action", event);

        if (isMobile) {
            if (action === "select") {
                const { slots } = event;
                const slotDate = new Date(slots[0]);
                slotDate.setHours(0, 0, 0, 0);
                const ifPassedDate = isInThePast(slotDate);

                if (ifPassedDate) {
                    return;
                }

                setNewEvent(event);
                setShouldShowEventDialog(true);
            }
        } else {
            if (action === "doubleClick") {
                const { slots } = event;
                const slotDate = new Date(slots[0]);
                slotDate.setHours(0, 0, 0, 0);
                const ifPassedDate = isInThePast(slotDate);

                if (ifPassedDate) {
                    return;
                }

                console.log("slots", slots);

                setNewEvent(event);
                setShouldShowEventDialog(true);
            }
        }
    };

    const onDrillDown = (data) => {
        console.log("data", data);
    };

    const openExistingEventDialog = async (event) => {
        const { start } = event;
        const slotDate = new Date(start);
        slotDate.setHours(0, 0, 0, 0);
        const ifPassedDate = isInThePast(slotDate);

        if (ifPassedDate) {
            enqueueSnackbar(`Meeting event expired!`, { variant: "error" });
            return;
        }

        await getMeetingAttendee(event.count);
        setShowViewEbeDialog(true);
        setEventData(event);
    };

    useEffect(() => {
        const updateCalendar = async () => {
            const response = await _logic.getMeetings(_commonLogic.getCount());
            const events = response?.map((e) => ({
                ...e,
                start: new Date(e.schedule),
                end: new Date(e.schedule),
            }));
            setMeetings(events);
        };
        updateCalendar();
    }, []);

    const gotoProfile = () => {
        navigate(`/profile/${_commonLogic.getId()}`);
    };

    const action = (
        <Button color="secondary" size="small" onClick={gotoProfile}>
            Go to Profile
        </Button>
    );

    const eventStyleGetter = (event, start, end, isSelected) => {
        const { type } = event;

        let opacity = 1;
        let background = bgSuccess;
        let textDecoration = "none";

        const slotDate = new Date(end);
        slotDate.setHours(0, 0, 0, 0);
        const ifPassedDate = isInThePast(slotDate);

        if (ifPassedDate) {
            background = bgError;
            textDecoration = "line-through";
            opacity = "0.6";
        } else {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (slotDate.toString() === now.toString()) {
                background = bgSuccess;
            } else {
                background = bgInfo;
            }
        }

        var style = {
            backgroundColor: background,
            textDecoration: textDecoration,
            borderRadius: "3px",
            opacity: opacity,
            border: type === "Virtual" ? "none" : `3px solid ${grey}`,
        };
        return {
            style: style,
        };
    };

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Meeting" }]} />
            </div>

            {ZoomLink === "" && (
                <SnackbarRoot>
                    <SnackbarContent
                        className="snackbar"
                        message="You must have added your zoom personal link to create a zoom event."
                        action={action}
                    />
                </SnackbarRoot>
            )}

            <FlexBox>
                <FlexBox>
                    <Small bgcolor={bgError}> Lapse </Small>
                    <Small bgcolor={bgSuccess}> Current</Small>
                    <Small bgcolor={bgInfo}> Incoming </Small>
                </FlexBox>
            </FlexBox>
            <Box py={1} />

            <CalendarRoot>
                <Box ref={headerComponentRef} />
                <DragAndDropCalendar
                    selectable
                    localizer={localizer}
                    events={meetings}
                    onEventDrop={handleEventMove}
                    resizable
                    onEventResize={handleEventResize}
                    defaultView={Views.MONTH}
                    defaultDate={new Date()}
                    startAccessor="start"
                    endAccessor="end"
                    views={viewList}
                    step={60}
                    showMultiDayTimes
                    components={{
                        toolbar: (props) => {
                            return headerComponentRef.current ? (
                                ReactDOM.createPortal(
                                    <CalendarHeader {...props} />,
                                    headerComponentRef.current
                                )
                            ) : (
                                <div>Header component not found</div>
                            );
                        },
                        // dateCellWrapper: (props) => (
                        //     <TouchCellWrapper {...props} onSelectSlot={onSelectSlotOnMobile} />
                        // )
                    }}
                    // onNavigate={handleNavigate}
                    onSelectEvent={(event) => {
                        openExistingEventDialog(event);
                    }}
                    onSelectSlot={(slotDetails) =>
                        openNewEventDialog(slotDetails)
                    }
                    onDrillDown={(slotDetails) => {
                        onDrillDown(slotDetails);
                    }}
                    eventPropGetter={eventStyleGetter}
                />
            </CalendarRoot>
            {shouldShowEventDialog && (
                <EventEditorDialog
                    getMeetings={getMeetings}
                    handleClose={handleDialogClose}
                    open={shouldShowEventDialog}
                    event={newEvent}
                    managers={managers}
                    zoomLink={ZoomLink}
                    gotoProfile={gotoProfile}
                />
            )}

            {showViewEbeDialog && (
                <ViewEvent
                    handleViewEventClose={handleViewEventClose}
                    open={showViewEbeDialog}
                    event={eventData}
                    attendees={attendees}
                    managers={managers}
                    getMeetingAttendee={getMeetingAttendee}
                    getMeetings={getMeetings}
                />
            )}
        </Container>
    );
};

export default MatxCalendar;
