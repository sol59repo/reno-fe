import React from "react";
import {
  DialogContent,
  DialogActions,
  DialogTitle,
  Dialog,
  Button,
} from "@mui/material";

const Dialogs = (props) => {
  const { open, Title, Content, Actions, size, closeModal, ...rest } = props;

  const _renderactions = () => {
    if (React.isValidElement(Actions)) {
      return Actions;
    } else if (Actions === undefined || Actions === null) {
      return;
    } else if (Actions) {
      return (
        <>
          <Button color="primary">Disagree</Button>
          <Button color="primary" autoFocus>
            Agree
          </Button>
        </>
      );
    }
  };

  return (
    <div>
      <Dialog
        maxWidth={size}
        fullWidth={true}
        open={open}
        onClose={closeModal}
        aria-labelledby="responsive-dialog-title"
        {...rest}
      >
        <DialogTitle id="responsive-dialog-title">{Title}</DialogTitle>
        <DialogContent>{Content()}</DialogContent>
        <DialogActions>{_renderactions()}</DialogActions>
      </Dialog>
    </div>
  );
};

Dialogs.defaultProps = {
  size: "lg", // xs,sm,md,lg,xl
  open: false,
  Title: "Dialog Title ",
  Content: () => {
    return <div>DialogContent</div>;
  },
  sx: {
    ".MuiDialog-paper": {
      position: "absolute",
      top: 0,
    },
  },
};

export default Dialogs;
