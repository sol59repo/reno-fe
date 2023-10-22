import React from "react";
import {
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Icon,
  Tooltip,
  IconButton,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { withStyles } from "tss-react/mui";
import { AlertConfirm } from "app/commons";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { getTimeLogsDifference, getTimeLogsTotalSpent } from "utils";

const defaultToolbarSelectStyles = {
  iconButton: {},
  iconContainer: {
    marginRight: "24px",
  },
  inverseIcon: {
    transform: "rotate(90deg)",
  },
};

const StyledIcon = styled(Icon)(() => ({
  color: "grey",
}));

class CustomToolbarSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStatus: "",
      timeType: "",
    };
  }

  handleChange = (event) => {
    const value = event.target.value;
    console.log("value", value);

    this.setState({ selectedStatus: value });
  };

  handleChangeTimeType = (event) => {
    this.setState({ timeType: event.target.value });
  };

  handleClickDeselectAll = () => {
    this.props.setSelectedRows([]);
  };

  _hanldeSubmitBulkActionsLeaveOrAbsent = (_selectedStatus) => {
    const { data } = this.props;
    const selectedData = [];
    this.props.selectedRows.data?.map((row) => {
      const rowData = data[row.index];
      const toSubmit = {
        count: rowData.count,
        status: _selectedStatus,
      };
      selectedData.push(toSubmit);
    });

    this.handLeActionLeaveOrAbsent(selectedData);
  };

  handleClickInverseSelection = () => {
    const nextSelectedRows = this.props.displayData.reduce(
      (nextSelectedRows, _, index) => {
        if (
          !this.props.selectedRows.data.find(
            (selectedRow) => selectedRow.index === index
          )
        ) {
          nextSelectedRows.push(index);
        }

        return nextSelectedRows;
      },
      []
    );
    this.props.setSelectedRows(nextSelectedRows);
  };

  checkStatus = (data) => {
    console.log(" this.props.selectedRows", this.props.selectedRows);
  };

  handleClickBlockSelected = async () => {
    const { data } = this.props;
    const selectedStatus = this.state.selectedStatus;
    const timeType = this.state.timeType;

    if (selectedStatus === "Leave" || selectedStatus === "Absent") {
      this._hanldeSubmitBulkActionsLeaveOrAbsent(selectedStatus);
      return;
    }

    if (timeType === "") {
      AlertConfirm({
        callback: () => {},
        title: "Please select time type and availability status",
        text: "Close this window to continue",
        icon: "error",
        confirmButtonText: "Yes, proceed!",
        showCancelButton: false,
      });
      return;
    }

    const formattedTime = format(
      new Date(),
      "MMM d yyyy 'at' h:m a"
    ).toUpperCase();

    console.log("data", data);
    const selectedData = [];
    this.props.selectedRows.data?.map((row) => {
      const rowData = data[row.index];
      const toSubmit = {
        count: rowData.count,
        status: timeType,
      };

      if (timeType === "In") {
        toSubmit.time = formattedTime;
        toSubmit.hourSpent =
          rowData.attendanceLogs.length === 0 ? 0 : rowData.hourSpent;
        toSubmit.timeSpent = 0;
      } else {
        toSubmit.time = formattedTime;
        const from = rowData.attendanceLogs[
          rowData.attendanceLogs.length - 1
        ]?.time.replace("AT", "");
        const to = formattedTime.replace("AT", "");
        const timeDiffs = getTimeLogsDifference(new Date(to), new Date(from));
        toSubmit.timeSpent = timeDiffs;
        toSubmit.hourSpent =
          parseFloat(rowData.hourSpent) + parseFloat(timeDiffs);
      }

      selectedData.push(toSubmit);
    });

    console.log("data props", data);
    console.log("data selectedData", selectedData);

    this.handLeAction(selectedData, selectedStatus);
  };

  handLeAction = (data, availabilityStatus) => {
    AlertConfirm({
      callback: () => this.props.submitBulkActions(data, availabilityStatus),
      title: "Bulk action time in logs?",
      text: "Please confirm",
      icon: "info",
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "No, cancel!",
    });
  };

  handLeActionLeaveOrAbsent = (data) => {
    AlertConfirm({
      callback: () => this.props.submitBulkActionsLeaveOrAbsent(data),
      title: "Bulk action time in logs?",
      text: "Please confirm",
      icon: "info",
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "No, cancel!",
    });
  };

  render() {
    const { classes } = this.props;

    return (
      // <div className={classes.iconContainer} >
      <Grid container spacing={2}>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <FormControl
            style={{
              width: "100%",
            }}
          >
            <InputLabel id="selectAvailabilty">Availability Status</InputLabel>
            <Select
              labelId="selectAvailabilty"
              id="selectAvailabilty-select"
              value={this.state.selectedStatus}
              label="Availability  Status"
              onChange={this.handleChange}
            >
              <MenuItem value={"Absent"}>Absent</MenuItem>
              <MenuItem value={"Present"}>Present</MenuItem>
              <MenuItem value={"Leave"}>Leave</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {this.state.selectedStatus === "Present" && (
          <>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <FormControl
                style={{
                  width: "100%",
                }}
              >
                <InputLabel id="selectAvailabilty">Type</InputLabel>
                <Select
                  labelId="selectAvailabilty"
                  id="selectAvailabilty-select"
                  value={this.state.timeType}
                  label="Availability  Status"
                  onChange={this.handleChangeTimeType}
                >
                  <MenuItem value={"In"}>Time In</MenuItem>
                  <MenuItem value={"Out"}>Time Out</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        {this.state.selectedStatus !== "" && (
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Tooltip title={"Send Selection"}>
              <IconButton
                className={classes.iconButton}
                onClick={this.handleClickBlockSelected}
              >
                <StyledIcon>check_box</StyledIcon>
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      // </div>
    );
  }
}

export default withStyles(CustomToolbarSelect, defaultToolbarSelectStyles, {
  name: "CustomToolbarSelect",
});
