import React, { useState, useEffect } from "react";
import {
  Dialog,
  Grid,
  TextField,
  Button,
  SnackbarContent,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Icon,
  Fab,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";
import { Box, styled, useTheme } from "@mui/system";
import ProjectLogic from "../../logic/ProjectLogic";
import CommonLogic from "app/logic/CommonLogic";
import { format } from "date-fns";
import AttendanceTable from "./attendance/Table";
import { AlertConfirm } from "app/commons";
import { DialogTitle } from "app/commons";
import { Span } from "app/components/Typography";
import Helpers from "app/utils/Helpers";
import { useSnackbar } from "notistack";
import { SimpleCard } from "app/components";
import { getTimeLogsDifference, getTimeLogsTotalSpent } from "utils";
import { ActionDialog } from "./attendance/ActionDialog";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const StyledSpan = styled(Span)(({ bgColor }) => ({
  color: "#fff",
  padding: "3px 10px",
  borderRadius: "2px",
  background: bgColor,
  width: "50%",
  textAlign: "center",
  margin: 10,
}));

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": {
      "& th": {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
  "& tbody": {
    "& tr": {
      "& td": {
        paddingLeft: 0,
        textTransform: "capitalize",
      },
    },
  },
}));

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  minWidth: 300,
}));

const JustifyBox = styled(FlexBox)(() => ({
  flexDirection: "row",
  justifyContent: "space-around",
}));

const SnackbarRoot = styled("div")(({ theme }) => ({
  maxWidth: 600,
  "& .snackbar": {
    margin: theme.spacing(1),
    background: "rgb(255, 61, 87)",
  },
}));

const Attendance = (props) => {
  let Now = new Date();
  const _logic = ProjectLogic();
  const _commonLogic = CommonLogic();
  const path = _commonLogic.getUrlPath();
  const modelId = path[2];

  const [open, setOpen] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [dialogData, setDialogData] = useState({});
  const [SingleAttendanceLogs, setSingleAttendanceLogs] = useState([]);
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    date: format(new Date(Now.setDate(Now.getDate())), "yyyy-MM-dd"),
    dateNow: format(new Date(), "yyyy-MM-dd"),
  });

  const { date, dateNow } = state;

  useEffect(() => {
    _getAsignedStaff();
    getAttendance(date);
  }, []);

  const _getAsignedStaff = async () => {
    const response = await _logic.getAsignedStaff(modelId);
    setStaffs(response);
  };

  const handleDateChange = (date) => {
    let refDate = format(new Date(date), "yyyy-MM-dd");

    setState({
      ...state,
      date: refDate,
    });
    getAttendance(refDate);
  };

  const submitBulkActions = async (data, availabilityStatus) => {
    const bodyData = {
      data: data,
      availabilityStatus: availabilityStatus,
    };
    const body = JSON.stringify(bodyData);
    const response = await _logic.submitBulkActions(body);
    if (response) {
      getAttendance(date);
    }
  };

  const submitBulkActionsLeaveOrAbsent = async (data) => {
    const bodyData = {
      data: data,
    };
    const body = JSON.stringify(bodyData);
    const response = await _logic.submitBulkActionsLeaveOrAbsent(body);
    if (response) {
      getAttendance(date);
    }
  };

  const getAttendance = async (_date) => {
    const response = await _logic.getAttendance({ date: _date });
    setData(response);
  };

  const _handleAddNewData = () => {
    AlertConfirm({
      callback: () => confirmaAddnewData(),
      title: "Add new data for the current date?",
      text: "Please confirm",
      icon: "info",
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "No, cancel!",
    });
  };

  const confirmaAddnewData = async () => {
    const data = {
      staffs: staffs,
      dateNow: format(new Date(), "yyyy-MM-dd"),
      projectModel: modelId,
    };

    const response = await _logic.addAttendanceData(data);

    if (response.status) {
      getAttendance(date);
    }
  };

  const handleOpen = async (count) => {
    await getSingleAttendance(count);
    await getSingleAttendanceLogs(count);
    setOpen(true);
  };

  const getSingleAttendance = async (count) => {
    const response = await _logic.getSingleAttendance(count);
    setDialogData(response[0]);
  };

  const getSingleAttendanceLogs = async (count) => {
    const response = await _logic.getSingleAttendanceLogs(count);
    setSingleAttendanceLogs(response);
  };

  return (
    <>
      <Grid container>
        <Grid item lg={4} md={4} sm={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={new Date(date)}
              onChange={(date) => handleDateChange(date)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  variant="standard"
                  id="mui-pickers-date"
                  label="Enter Date*"
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item lg={4} md={4} sm={12}>
          {data.length === 0 && (
            <SnackbarRoot>
              <SnackbarContent
                className="snackbar"
                message={" No data for selected date!"}
                action={
                  date.toString() === dateNow.toString() ? (
                    <>
                      <Button
                        color="inherit"
                        size="small"
                        style={{ backgroundColor: "rgb(237, 108, 2)" }}
                        onClick={_handleAddNewData}
                      >
                        Generate data for todays date
                      </Button>
                    </>
                  ) : null
                }
              />
            </SnackbarRoot>
          )}
        </Grid>
      </Grid>

      <Box>
        <AttendanceTable
          data={data}
          handleOpen={handleOpen}
          submitBulkActions={submitBulkActions}
          submitBulkActionsLeaveOrAbsent={submitBulkActionsLeaveOrAbsent}
        />
      </Box>

      <ActionDialog
        open={open}
        setOpen={setOpen}
        dialogData={dialogData}
        getSingleAttendance={getSingleAttendance}
        SingleAttendanceLogs={SingleAttendanceLogs}
        getSingleAttendanceLogs={getSingleAttendanceLogs}
        getAttendance={() => getAttendance(date)}
        modelId={modelId}
      />
    </>
  );
};

export default Attendance;
