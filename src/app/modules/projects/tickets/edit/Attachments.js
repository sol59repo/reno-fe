import React, { useState, useRef } from "react";
import {
  Grid,
  Card,
  Dialog,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import { Box, styled } from "@mui/system";
import { H6, Small } from "app/components/Typography";
import Attachment from "@mui/icons-material/Attachment";
import format from "date-fns/format";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import ProjectLogic from "../../logic/ProjectLogic";
import CommonLogic from "app/logic/CommonLogic";
import { AlertConfirm, Dialogs } from "app/commons";
import Pdf from "app/modules/pdf/src";
import pdfPlaceholder from "app/assets/images/pdf-placeholder.png";
import placeholder from "app/assets/images/placeholder.png";
import SignatureCanvas from "react-signature-canvas";
import UploadFile from "@mui/icons-material/UploadFile";
import Clear from "@mui/icons-material/Clear";
import { useSnackbar } from "notistack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LazyLoadImage } from "react-lazy-load-image-component";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const Heading = styled(H6)(({ theme }) => ({
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  paddingTop: "16px !important",
  flexDirection: "center",
  background: theme.palette.background.default,
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0px 24px !important",
  paddingTop: "16px !important",
  [theme.breakpoints.down("sm")]: {
    padding: "0px 12px !important",
  },
}));

const IMG = styled("img")(({ theme }) => ({
  width: "30%",
}));

const IMGDIALOG = styled("img")(({ theme }) => ({
  width: "100%",
}));

const Attachments = ({ attachments, getCardActivities, loadingActivities }) => {
  const _logic = ProjectLogic();
  const _commonLogic = CommonLogic();
  const { enqueueSnackbar } = useSnackbar();

  const [shownImage, setShownImage] = useState(false);
  const [shownPdf, setShownPdf] = useState(false);
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);
  const [url, setUrl] = useState("");

  console.log("loadingActivities=>", loadingActivities);

  const isPdf = url.indexOf(".pdf");

  const showImage = (url) => {
    if (url.indexOf(".pdf") !== -1) {
      setShownPdf(true);
    } else {
      setShownImage(true);
    }
    setUrl(url);
  };

  const handleDelete = async (file) => {
    const data = {
      count: file.count,
      fileName: file.fileName,
      fkCard: file.fkCard,
      addedBy: _commonLogic.getId(),
    };

    AlertConfirm({
      callback: () => confirmDelete(data),
      title: "Remove attachment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "No, cancel!",
    });
  };

  const confirmDelete = async (data) => {
    const response = await _logic.deleteAttachment(data);
    if (response) {
      getCardActivities();
    }
  };

  const renderAttachments = () => {
    const _attachments = attachments.map((file, id) => {
      const formatDate = new Date(file.dateTime);
      const dateTime = format(formatDate, "MMM d, yyyy 'at' h:m a");
      const filePath = file?.filePath;
      var _isPdf;
      if (filePath.indexOf(".pdf") !== -1) {
        _isPdf = true;
      } else {
        _isPdf = false;
      }

      const renderSignatures = (url) => {
        if (loadingActivities) {
          return;
        }
        return (
          <LazyLoadImage src={url} alt="cover" width={"30%"} loading="lazy" />
        );
      };

      return (
        <Grid key={id} item lg={12} md={12} sm={12} xs={12}>
          <FlexBox>
            <StyledCard>
              <IMG
                src={
                  loadingActivities
                    ? placeholder
                    : _isPdf
                    ? pdfPlaceholder
                    : filePath
                }
                alt="cover"
                onClick={() => showImage(filePath)}
              />

              <Box
                ml={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Heading
                  sx={{ color: "#42526e" }}
                  onClick={() => showImage(filePath)}
                >
                  {file.fileName}
                </Heading>
                <Heading
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => showImage(filePath)}
                >
                  Added last {dateTime}
                </Heading>
                <div className="button-group">
                  <Button
                    size="small"
                    variant="contained"
                    color={"error"}
                    sx={{
                      mr: "4px",
                      fontSize: "0.8125rem",
                      textTransform: "capitalize",
                      height: 20,
                    }}
                    onClick={() => handleDelete(file)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color={"info"}
                    sx={{
                      mr: "4px",
                      fontSize: "0.8125rem",
                      textTransform: "capitalize",
                      height: 20,
                    }}
                    onClick={() => setShowSignatureCanvas(file?.count)}
                  >
                    Send Signature
                  </Button>
                </div>
                {file?.signature !== null && (
                  <>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4} md={6}>
                          <Box
                            padding={1}
                            sx={{
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                              boxShadow: "1px 3px 1px #9E9E9E",
                            }}
                          >
                            <>{renderSignatures(file.signature)}</>
                          </Box>
                          <Box
                            flex={1}
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <Typography color="info">Signature</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={8} md={6}>
                          <CopyToClipboard
                            text={file?.signature}
                            onCopy={() =>
                              enqueueSnackbar(`Copied`, {
                                variant: "success",
                              })
                            }
                          >
                            <IconButton edge="start" color="info">
                              <ContentCopyIcon />
                            </IconButton>
                          </CopyToClipboard>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
              </Box>
            </StyledCard>
          </FlexBox>
        </Grid>
      );
    });

    return _attachments;
  };

  return (
    <>
      <ContentBox pt={0}>
        <FlexBox>
          <Attachment sx={{ color: "#42526e" }} />
          <Heading sx={{ ml: 2, color: "#42526e" }}>Attachment</Heading>
        </FlexBox>
        <Box className="comments">
          <Grid container spacing={2}>
            {renderAttachments()}
          </Grid>
        </Box>
        {isPdf !== -1 ? (
          <PdfDialog url={url} shownPdf={shownPdf} setShownPdf={setShownPdf} />
        ) : (
          <ImageDialog
            url={url}
            shownImage={shownImage}
            setShownImage={setShownImage}
          />
        )}

        <SignatureDialog
          getCardActivities={getCardActivities}
          showSignatureCanvas={showSignatureCanvas}
          setShowSignatureCanvas={setShowSignatureCanvas}
        />
      </ContentBox>
    </>
  );
};

export default Attachments;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ImageDialog = ({ url, shownImage, setShownImage }) => {
  return (
    <Dialog
      open={shownImage}
      fullScreen
      fullWidth={true}
      onClose={() => setShownImage(false)}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <AppBar sx={{ position: "relative", background: "transparent" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="error"
            onClick={() => setShownImage(false)}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: "85%",
          alignSelf: "center",
        }}
      >
        <IMGDIALOG src={url} alt="cover" />
      </Box>
    </Dialog>
  );
};

const PdfDialog = ({ url, shownPdf, setShownPdf }) => {
  return (
    <Dialogs
      title="Pdf"
      size={"lg"}
      closeModal={() => setShownPdf(false)}
      open={shownPdf}
      Content={() => <Pdf url={url} />}
    />
  );
};

const SignatureDialog = ({
  showSignatureCanvas,
  setShowSignatureCanvas,
  getCardActivities,
}) => {
  return (
    <Dialogs
      Title="Create Signature"
      size={"sm"}
      closeModal={() => setShowSignatureCanvas(false)}
      open={showSignatureCanvas !== false ? true : false}
      Content={() => (
        <Canvas
          getCardActivities={getCardActivities}
          showSignatureCanvas={showSignatureCanvas}
          setShowSignatureCanvas={setShowSignatureCanvas}
        />
      )}
    />
  );
};

const Canvas = ({
  getCardActivities,
  showSignatureCanvas,
  setShowSignatureCanvas,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const _logic = ProjectLogic();
  let sigCanvas = useRef({});
  let [cBase64, setBase64] = useState("");

  const uploadSignature = async () => {
    if (cBase64 === "") {
      enqueueSnackbar(`Canvas is empty`, { variant: "error" });
      return;
    }

    const file = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    const body = new FormData();
    // body.append("file", newImage);
    body.append("file", file);
    body.append("count", showSignatureCanvas);
    const response = await _logic.uploadSignature(body);
    if (response.status) {
      setShowSignatureCanvas(false);
      getCardActivities();
    }
  };

  const clear = () => {
    sigCanvas.current.clear();
    setBase64("");
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          background: "lightgray",
        }}
      >
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={(e) => {
            setBase64(sigCanvas.current.toDataURL());
          }}
          canvasProps={{
            width: 500,
            height: 300,
          }}
        />
      </Box>
      <Box py={1} />
      <Box
        flexDirection={"row"}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          color={"error"}
          sx={{
            mr: "4px",
            fontSize: "0.8125rem",
            textTransform: "capitalize",
          }}
          onClick={() => clear()}
        >
          <Clear />
          Clear
        </Button>
        <Button
          variant="contained"
          color={"info"}
          sx={{
            mr: "4px",
            fontSize: "0.8125rem",
            textTransform: "capitalize",
          }}
          onClick={uploadSignature}
        >
          <UploadFile />
          Upload
        </Button>
      </Box>
    </React.Fragment>
  );
};
