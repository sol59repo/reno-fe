import React, { useState, useEffect } from "react";
import { TextField, Avatar, Button, Input } from "@mui/material";
import { getTimeDifference } from "utils.js";
import Scrollbar from "react-perfect-scrollbar";
import { Box, styled, useTheme } from "@mui/system";
import { H6, Small, Paragraph } from "app/components/Typography";
import FormatListBulletedSharp from "@mui/icons-material/FormatListBulletedSharp";
import { ImageDialog } from "./Attachments";
import format from "date-fns/format";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ProjectLogic from "../../logic/ProjectLogic";
import { useSnackbar } from "notistack";
import { AlertConfirm, Dialogs } from "app/commons";
import CommonLogic from "app/logic/CommonLogic";
import pdfPlaceholder from "app/assets/images/pdf-placeholder.png";
import Pdf from "app/modules/pdf/src";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(() => ({
  height: "32px",
  width: "32px",
}));

const Heading = styled(H6)(({ theme }) => ({
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0px 24px !important",
  paddingTop: "16px !important",
  [theme.breakpoints.down("sm")]: {
    padding: "0px 12px !important",
  },
}));

const IMGDIALOG = styled("img")(({ theme }) => ({
  width: "70%",
  alignSelf: "center",
}));

const Activity = ({
  activities,
  sendComment,
  textMuted,
  handleChange,
  commentText,
  user,
  getCardActivities,
}) => {
  const _logic = ProjectLogic();
  const _commonLogic = CommonLogic();
  const { enqueueSnackbar } = useSnackbar();

  const [shownImage, setShownImage] = useState(false);
  const [url, setUrl] = useState("");
  const [shownPdf, setShownPdf] = useState(false);
  const [edit, setEdit] = useState("");
  const [editedText, setEditedText] = useState("");

  const isPdf = url.indexOf(".pdf");

  const showImage = (url) => {
    if (url.indexOf(".pdf") !== -1) {
      setShownPdf(true);
    } else {
      setShownImage(true);
    }
    setUrl(url);
  };

  const editText = (count, text) => {
    setEdit(count);
    setEditedText(text);
  };

  const saveChanges = async (count) => {
    if (editedText == "") {
      enqueueSnackbar(`Error: Comment field is empty!`, { variant: "error" });
      return;
    }
    const data = {
      content: editedText,
      count: edit,
    };
    const response = await _logic.updateComment(data);
    console.log("response", response);
    if (response) {
      setEdit("");
      getCardActivities();
    }
  };

  const handleEditTextChange = (event) => {
    setEditedText(event.target.value);
  };

  const handleDelete = async (count) => {
    const data = {
      count: count,
    };

    AlertConfirm({
      callback: () => confirmDelete(data),
      title: "Remove comment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "No, cancel!",
    });
  };

  const confirmDelete = async (data) => {
    const response = await _logic.deleteComment(data);
    if (response) {
      getCardActivities();
    }
  };

  return (
    <>
      <ContentBox>
        <FlexBox>
          <FormatListBulletedSharp sx={{ color: "#42526e" }} />
          <Heading sx={{ ml: 2, color: "#42526e" }}>Activity</Heading>
        </FlexBox>
        <Box className="comments">
          <FlexBox mb={2}>
            <StyledAvatar src={user.photoURL} sizes={"36"} />
            <Box display="flex" flexGrow={1}>
              <TextField
                onChange={handleChange}
                onKeyDown={handleChange}
                variant="outlined"
                name="commentText"
                value={commentText || ""}
                fullWidth
                inputProps={{
                  style: {
                    padding: "10px",
                  },
                }}
                sx={{ m: "12px", color: textMuted }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              size={"small"}
              onClick={sendComment}
            >
              Send
            </Button>
          </FlexBox>
          {activities.map((comment) => {
            return (
              <Box mb={2} key={comment.count}>
                <FlexBox mb={1}>
                  <StyledAvatar src={comment?.avatar} sizes={"36"} />
                  <FlexBox ml="12px">
                    <H6 sx={{ fontWeight: 700, marginRight: 3 }}>
                      {comment.empName}
                    </H6>

                    {comment.type == "file" && (
                      <Paragraph>
                        {comment.content}

                        <Small sx={{ color: textMuted }}>
                          {format(
                            new Date(comment.dateTime),
                            "MMM d, yyyy 'at' h:m a"
                          )}
                        </Small>
                      </Paragraph>
                    )}

                    {comment.type == "delete" && (
                      <Paragraph>
                        {comment.content}

                        <Small sx={{ color: textMuted }}>
                          {format(
                            new Date(comment.dateTime),
                            "MMM d, yyyy 'at' h:m a"
                          )}
                        </Small>
                      </Paragraph>
                    )}

                    {comment.type == "comment" && (
                      <Small sx={{ color: textMuted }}>
                        {format(
                          new Date(comment.dateTime),
                          "MMM d, yyyy 'at' h:m a"
                        )}
                      </Small>
                    )}
                  </FlexBox>
                </FlexBox>
                {comment.type == "comment" && (
                  <>
                    {edit == comment.count ? (
                      <TextField
                        variant="outlined"
                        name="editedText"
                        value={editedText}
                        onChange={handleEditTextChange}
                        onKeyDown={handleEditTextChange}
                        fullWidth
                        sx={{ color: textMuted }}
                      />
                    ) : (
                      <TextField
                        variant="outlined"
                        name="commentText"
                        value={comment.content}
                        fullWidth
                        sx={{ color: textMuted }}
                        inputProps={{
                          readOnly: true,
                          disabled: true,
                        }}
                      />
                    )}
                    <FlexBox
                      sx={{
                        alignItems: "space-between",
                        justifyContent: "space-between",
                      }}
                    >
                      <FlexBox>
                        {edit === comment.count && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              size={"small"}
                              sx={{
                                margin: 0.5,
                              }}
                              onClick={() => saveChanges(comment.count)}
                            >
                              Save
                            </Button>

                            <Button
                              variant="outlined"
                              color="primary"
                              size={"small"}
                              sx={{
                                margin: 0.5,
                              }}
                              onClick={() => setEdit("")}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </FlexBox>

                      <FlexBox
                        sx={{
                          alignItems: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        {edit === comment.count ? (
                          <></>
                        ) : (
                          <>
                            {comment.addedBy == _commonLogic.getId() && (
                              <>
                                <ListItemButton
                                  sx={{
                                    py: 0,
                                    minHeight: 32,
                                    color: "#42526e",
                                    background: "transparent",
                                    maxWidth: 60,
                                    minWidth: 60,
                                  }}
                                  onClick={() =>
                                    editText(comment.count, comment.content)
                                  }
                                >
                                  <ListItemText
                                    primary={"Edit"}
                                    primaryTypographyProps={{
                                      fontSize: 14,
                                      fontWeight: "medium",
                                    }}
                                    sx={{ textDecoration: "underline" }}
                                  />
                                </ListItemButton>
                                <ListItemButton
                                  sx={{
                                    py: 0,
                                    minHeight: 32,
                                    color: "#42526e",
                                    background: "transparent",
                                    maxWidth: 60,
                                    minWidth: 60,
                                  }}
                                  onClick={() => handleDelete(comment.count)}
                                >
                                  <ListItemText
                                    primary={"Delete"}
                                    primaryTypographyProps={{
                                      fontSize: 14,
                                      fontWeight: "medium",
                                    }}
                                    sx={{ textDecoration: "underline" }}
                                  />
                                </ListItemButton>
                              </>
                            )}
                          </>
                        )}
                      </FlexBox>
                    </FlexBox>
                  </>
                )}
                {comment.type === "file" && (
                  <ListItemButton
                    onClick={() => showImage(comment.filePath)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <IMGDIALOG src={pathType(comment.filePath)} alt="cover" />
                  </ListItemButton>
                )}
              </Box>
            );
          })}
        </Box>
      </ContentBox>

      {isPdf !== -1 ? (
        <PdfDialog url={url} shownPdf={shownPdf} setShownPdf={setShownPdf} />
      ) : (
        <ImageDialog
          url={url}
          shownImage={shownImage}
          setShownImage={setShownImage}
        />
      )}
    </>
  );
};

const pathType = (filePath) => {
  if (filePath.indexOf(".pdf") !== -1) {
    return pdfPlaceholder;
  } else {
    return filePath;
  }
};

const PdfDialog = ({ url, shownPdf, setShownPdf }) => {
  return (
    <Dialogs
      Title=""
      size={"lg"}
      closeModal={() => setShownPdf(false)}
      open={shownPdf}
      Content={() => <Pdf url={url} />}
    />
  );
};

export default Activity;
