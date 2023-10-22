import React from "react";

import { Button } from "@mui/material";
import DocumentPreview from "./DocumentPreview";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
};

class Pdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      file: this.props.url,
    };
  }

  preview = (file) => {
    // return this.setState({ show: true, file: file });
  };
  render = () => (
    <div style={styles}>
      <DocumentPreview
        url={this.props.url}
        show={true}
        file={this.props.url}
        onClose={() => this.setState({ show: false })}
        toolbar={
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
          >
            Download
          </Button>
        }
        footer={<div>my footer</div>}
      />
    </div>
  );
}

export default Pdf;
