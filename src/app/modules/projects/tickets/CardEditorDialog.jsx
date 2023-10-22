import React, { useState, useEffect } from "react";
import {
  Dialog,
  Icon,
  Avatar,
  Button,
  IconButton,
  Grid,
  Input,
  useMediaQuery,
} from "@mui/material";
import Scrollbar from "react-perfect-scrollbar";
import { useDispatch } from "react-redux";
import { Box, styled, useTheme } from "@mui/system";
import { H6 } from "app/components/Typography";
import CommonLogic from "app/logic/CommonLogic";
import ProjectLogic from "../logic/ProjectLogic";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import SideButtons from "./edit/SideButtons";
import Description from "./edit/Description";
import Activity from "./edit/Activity";
import Attachments from "./edit/Attachments";
import Title from "./edit/Title";
import CardMembers from "./edit/CardMembers";
import Status from "./edit/Status";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "space-between",
}));

const StyledInput = styled(Input)(() => ({
  flexGrow: 1,
  fontSize: "16px",
  fontWeight: "500",
  paddingLeft: "3px",
  paddingRight: "8px",
  marginLeft: "12px",
  textTransform: "capitalize",
}));

const StyledScrollBar = styled(Scrollbar)(() => ({
  maxHeight: 380,
  position: "relative",
  paddingTop: "16px",
  marginBottom: "16px",
  background: "#091e420a",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0px 24px !important",
  paddingTop: "16px !important",
  [theme.breakpoints.down("sm")]: {
    padding: "0px 12px !important",
  },
}));

const CardEditorDialog = ({
  open,
  card,
  handleClose,
  getCardLists,
  getSequence,
  propcardMembers,
  geticketCardMembers,
  handleCardArchived,
  cardList,
}) => {
  const { id } = useParams();

  const [state, setState] = useState({
    summary: "",
    cardMembers: [],
    staffs: [],
    labels: [],
    description: "",
    commentText: "",
  });

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [listName, setListName] = useState("---");
  const [attachments, setAttachments] = useState([]);

  const _commonlogic = CommonLogic();
  const _logic = ProjectLogic();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = {};

  const closeDialog = () => {
    handleClose();
  };

  useEffect(() => {
    const getCrdListDEsc = cardList.filter(
      (val) => val.count == card.fkCardList
    );
    setListName(getCrdListDEsc[0].name);
  }, [cardList]);

  useEffect(() => {
    setState({
      ...state,
      summary: card.summary,
      description: card.description,
      labels: JSON.parse(card.status),
      cardMembers: propcardMembers,
    });
  }, [card, propcardMembers]);

  const handleChange = (event) => {
    let target = event.target;
    let id = target.value;

    if (event.target.name === "label") {
      let id = event.target.value;
      let { labels } = state;
      let label = listStatus.find((item) => item.id === parseInt(id));
      if (!event.target.checked) {
        labels.splice(labels.indexOf(label), 1);
        setState({ ...state, labels });
      } else {
        labels.push(label);
        setState({ ...state, labels });
      }

      sendStatus(labels);
    } else if (event.target.name === "avatar") {
      let id = event.target.value;
      let { cardMembers } = state;
      let member = staffs.find((user) => user.ID === id);

      if (!event.target.checked) {
        cardMembers.splice(cardMembers.indexOf(member), 1);
        setState({ ...state, cardMembers });
        sendticketCardMembers(member, "Inactive");
      } else {
        cardMembers.push(member);
        sendticketCardMembers(member, "Active");
        setState({ ...state, cardMembers });
      }
    } else if (
      event.key === "Enter" &&
      !event.shiftKey &&
      target.name === "commentText"
    ) {
      setState({
        ...state,
        [event.target.name]: event.target.value,
      });
      sendComment();
    } else {
      setState({
        ...state,
        [event.target.name]: event.target.value,
      });
    }
  };

  const sendticketCardMembers = async (cardMembers, type) => {
    const response = await _logic.sendticketCardMembers({
      cardMembers: cardMembers,
      fkCardId: card.count,
      type: type,
    });
    if (response) {
      const resp = await geticketCardMembers(card.count);
      setState({
        ...state,
        cardMembers: resp,
      });
    }
  };

  const sendStatus = async (labels) => {
    const response = await _logic.sendTicketCardStatus({
      objStatus: labels,
      count: card.count,
    });
    if (response) {
      getCardLists();
      getSequence();
    }
  };

  const handleSave = async () => {
    console.log("description", description);
    console.log("summary", summary);
    if (
      summary === "" ||
      description === "" ||
      summary === undefined ||
      description === undefined
    ) {
      enqueueSnackbar(`Please fill out empty fileds!`, { variant: "error" });
      return;
    }

    const body = {
      summary: summary,
      description: description,
      count: card.count,
    };

    const response = await _logic.updateCardInfo(body);
    if (response) {
      getCardLists();
      getSequence();
    }
  };

  const sendComment = async () => {
    if (commentText === "" || commentText === undefined) {
      enqueueSnackbar(`Comment area is empty!`, { variant: "error" });
      return;
    }
    const data = {
      fkCard: card.count,
      content: commentText,
      addedBy: _commonlogic.getId(),
    };
    const response = await _logic.sendTicketCardComment(data);
    if (response.status) {
      getCardActivities();
      setState({
        ...state,
        commentText: "",
      });
    }
  };

  useEffect(() => {
    getCardActivities();
  }, []);

  const getCardActivities = async () => {
    setLoadingActivities(true);
    const response = await _logic.getCardActivities(card.count);
    const attachments = response.filter((val) => val.filePath != null);
    setAttachments(attachments);
    setActivities(response);
    setTimeout(() => {
      setLoadingActivities(false);
    }, [2000]);
  };

  useEffect(() => {
    _getAsignedStaff();
  }, []);

  const _getAsignedStaff = async () => {
    const response = await _logic.getAsignedStaff(id);
    setStaffs(response);
  };

  let {
    summary,
    cardMembers = [],
    labels = [],
    description,
    commentText,
  } = state;

  const { palette } = useTheme();
  const textMuted = palette.text.secondary;
  const textPrimary = palette.primary.main;
  const bgPrimary = palette.primary.main;
  const bgLightGrey = "rgba(0, 0, 0, 0.01)";

  return (
    <Dialog
      onClose={closeDialog}
      open={open}
      fullScreen={isMobile}
      fullWidth={true}
      scroll="body"
      maxWidth="md"
    >
      <div className="scrum-board">
        <ContentBox>
          <FlexBox>
            <FlexBox flexGrow={1}>
              <Icon sx={{ color: "#42526e" }}>assignment</Icon>
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
          <Grid container>
            <Grid item lg={10} md={10} sm={12} xs={12} sx={{ mt: 0 }}>
              <Box ml={5}>
                <Title listName={listName} />
                <JustifyBox mb={2}>
                  <CardMembers
                    cardMembers={cardMembers}
                    staffs={staffs}
                    handleChange={handleChange}
                  />
                  <Status
                    listStatus={listStatus}
                    labels={labels}
                    handleChange={handleChange}
                    bgLightGrey={bgLightGrey}
                    bgPrimary={bgPrimary}
                  />
                </JustifyBox>
              </Box>

              <StyledScrollBar>
                <Description
                  textMuted={textMuted}
                  description={description}
                  handleChange={handleChange}
                />

                <Attachments
                  attachments={attachments}
                  activities={activities}
                  sendComment={sendComment}
                  textMuted={textMuted}
                  handleChange={handleChange}
                  commentText={commentText}
                  user={user}
                  getCardActivities={getCardActivities}
                  loadingActivities={loadingActivities}
                />

                <Activity
                  activities={activities}
                  sendComment={sendComment}
                  textMuted={textMuted}
                  handleChange={handleChange}
                  commentText={commentText}
                  user={user}
                  getCardActivities={getCardActivities}
                />
              </StyledScrollBar>
            </Grid>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <ContentBox
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <SideButtons
                  staffs={staffs}
                  getCardActivities={getCardActivities}
                  cardMembers={cardMembers}
                  handleChange={handleChange}
                  listStatus={listStatus}
                  labels={labels}
                  handleCardArchived={() =>
                    handleCardArchived(card.fkCardList, card.id)
                  }
                  cardCount={card.count}
                  addedBy={_commonlogic.getId()}
                />
              </ContentBox>
            </Grid>
          </Grid>
        </ContentBox>

        <ContentBox pt={0} mb="12px" display="flex" justifyContent="flex-end">
          <Button
            variant={"outlined"}
            sx={{ mr: "12px" }}
            onClick={closeDialog}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </ContentBox>
      </div>
    </Dialog>
  );
};

export default CardEditorDialog;

const listStatus = [
  {
    id: 1,
    title: "Pending",
    color: "primary",
  },
  {
    id: 2,
    title: "Completed",
    color: "success",
  },
  {
    id: 3,
    title: "Inprogress",
    color: "secondary",
  },
  {
    id: 4,
    title: "High Priority",
    color: "error",
  },
];
