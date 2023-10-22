import React from "react";
import { api } from "app/services/api";
import Helpers from "app/utils/Helpers";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";

import { setProjectLists } from "app/redux/actions/projectActions";
import { setOverlayState } from "app/redux/actions/commonActions";

const ProjectLogic = (props) => {
  const _helpers = Helpers();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const _getLists = async (postData) => {
    const body = JSON.stringify(postData);
    const response = await api.post("model/getProjects", body);
    let data = await response.json();
    if (response.status === 200) {
      let _decodeData = await _helpers._return(data);
      dispatch(setProjectLists(_decodeData.apiRet));
    } else {
      enqueueSnackbar(`Error retrieving of Projects!`, { variant: "error" });
      return;
    }
  };

  const _getProject = async (postData) => {
    const body = JSON.stringify(postData);
    const response = await api.post("model/getModel", body);
    let data = await response.json();
    if (response.status === 200) {
      let _decodeData = await _helpers._return(data);
      return _decodeData.apiRet;
    } else {
      enqueueSnackbar(`Error retrieving of Projects!`, { variant: "error" });
      return;
    }
  };

  return {
    getMeasurements: async (id) => {
      const response = await api.get(`model/getMeasurements/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of Measurements!`, {
          variant: "error",
        });
        return;
      }
    },
    getTickets: async (id) => {
      const response = await api.get(`model/getTickets/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of Tickets!`, { variant: "error" });
        return;
      }
    },
    getModels: async () => {
      const response = await api.get(`model/matterportmodels`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      }
    },
    getLocationName: async (id) => {
      const response = await api.get(`model/getLocationName/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      }
    },
    getComments: async (id) => {
      const response = await api.get(`model/getComments/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      }
    },
    getObjStatus: async (id) => {
      const response = await api.get(`model/getObjStatus/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      }
    },
    getcommentsMembers: async (id) => {
      const response = await api.get(`model/getcommentsMembers/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      }
    },
    getLists: (postData) => {
      _getLists(postData);
    },
    getModel: (postData) => {
      return _getProject(postData);
    },
    addProject: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/addProject", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully added Model project!`, {
          variant: "success",
        });
        _getLists({ status: "All" });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of project!`, { variant: "error" });
        return;
      }
    },
    AddToProject: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/AddToProject", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully added Model project!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of project!`, { variant: "error" });
        return;
      }
    },
    sendComment: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/sendComment", body);
      let data = await response.json();
      if (response.status === 200) {
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Comment!`, { variant: "error" });
        return;
      }
    },
    initComments: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/initComments", body);
      let data = await response.json();
      if (response.status === 200) {
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Comment!`, { variant: "error" });
        return;
      }
    },
    sendStatus: async ({ objStatus, refId }) => {
      const body = JSON.stringify({ refId: refId, objStatus: objStatus });
      const response = await api.post("model/sendStatus", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated status!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    sendTicketCardStatus: async ({ objStatus, refId }) => {
      const body = JSON.stringify({ refId: refId, objStatus: objStatus });
      const response = await api.post("model/sendStatus", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated status!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    sendMembers: async ({ cardMembers, refId, type }) => {
      const body = JSON.stringify({
        refId: refId,
        cardMembers: cardMembers,
        type: type,
      });
      const response = await api.post("model/sendMembers", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated status!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },

    saveModelChanges: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/saveModelChanges", body);
      let data = await response.json();
      if (response.status === 200) {
        setTimeout(() => {
          dispatch(setOverlayState({ active: false, text: "" }));
          enqueueSnackbar(`Model changes saved!`, { variant: "success" });
        }, 1000);
        return true;
      } else {
        enqueueSnackbar(`Error adding of project!`, { variant: "error" });
        return false;
      }
    },
    updateStatus: async ({ status, Model }) => {
      const body = JSON.stringify({ ModelId: Model, status: status });
      const response = await api.post("model/updateStatus", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Model marked as ${status}!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },

    updateSpaceStatus: async ({ status, spaceId }) => {
      const body = JSON.stringify({ spaceId: spaceId, status: status });
      const response = await api.post("model/updateSpaceStatus", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Model marked as ${status}!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    updateAttendanceAvailability: async ({ count, availabilityStatus }) => {
      const body = JSON.stringify({
        count: count,
        availabilityStatus: availabilityStatus,
      });
      const response = await api.post(
        "model/updateAttendanceAvailability",
        body
      );
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Employee marked as ${availabilityStatus}!`, {
            variant: "success",
          });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    submitBulkActions: async (body) => {
      const response = await api.post("model/submitBulkActions", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Submitted time log!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    submitBulkActionsLeaveOrAbsent: async (body) => {
      const response = await api.post(
        "model/submitBulkActionsLeaveOrAbsent",
        body
      );
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Submitted time log!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    submitAction: async (body) => {
      const response = await api.post("model/submitAction", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Submitted time log!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    updateAsignmentStatus: async ({ status, count }) => {
      const body = JSON.stringify({ count: count, status: status });
      const response = await api.post("model/updateAsignmentStatus", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated Status!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    updateAdeddConsumableStatus: async ({ status, count }) => {
      const body = JSON.stringify({ count: count, status: status });
      const response = await api.post(
        "model/updateAdeddConsumableStatus",
        body
      );
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated Status!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    getAllStaffs: async () => {
      const response = await api.get("model/getAllStaffs");
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getAllManagers: async () => {
      const response = await api.get("model/getAllManagers");
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getAllMaterials: async () => {
      const response = await api.get("model/getAllMaterials");
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getAsignedStaff: async (modelId) => {
      const response = await api.get(`model/getAsignedStaff/${modelId}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getSingleAttendance: async (count) => {
      const response = await api.get(`model/getSingleAttendance/${count}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getSingleAttendanceLogs: async (count) => {
      const response = await api.get(`model/getSingleAttendanceLogs/${count}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getProject: async (modelId) => {
      const response = await api.get(`model/getProject/${modelId}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },

    getProjectSpace: async (modelId) => {
      const response = await api.get(`model/getProjectSpace/${modelId}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getAsignedManager: async (modelId) => {
      const response = await api.get(`model/getAsignedManager/${modelId}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getAsignedMaterials: async (count) => {
      const response = await api.get(`model/getAsignedMaterials/${count}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    asignStaff: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/asignStaff", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully asigned Staff to project!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error asigning of Staff!`, { variant: "error" });
        return;
      }
    },
    addMaterial: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/addMaterial", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully added Material to project!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Material!`, { variant: "error" });
        return;
      }
    },
    addAttendanceData: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/addAttendanceData", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully added new data for attendance!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Material!`, { variant: "error" });
        return;
      }
    },
    addTicket: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/addTicket", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully added new ticket!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Material!`, { variant: "error" });
        return;
      }
    },
    getTickets: async (modelId) => {
      const response = await api.get(`model/getTickets/${modelId}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },

    getAttendance: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/getAttendance", body);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error adding of Material!`, { variant: "error" });
        return;
      }
    },
    getEmployeesAttendance: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/getEmployeesAttendance", body);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error adding of Material!`, { variant: "error" });
        return;
      }
    },
    getEmployeeAttendance: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/getEmployeeAttendance", body);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error adding of Material!`, { variant: "error" });
        return;
      }
    },
    qtyUpdate: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/qtyUpdate", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully Updated Material to project!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Material!`, { variant: "error" });
        return;
      }
    },
    isInArray: (projects, obj) => {
      var i;
      for (i = 0; i < projects.length; i++) {
        if (projects[i].modelId === obj.id) {
          return true;
        }
      }
      return false;
    },
    addCardList: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/addCardList", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully added new list!`, { variant: "success" });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Cardlist!`, { variant: "error" });
        return;
      }
    },
    addCard: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/addCard", body);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully added new ticket!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Card:!`, { variant: "error" });
        return;
      }
    },
    getCardLists: async (modelId) => {
      const response = await api.get(`model/getCardLists/${modelId}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getSequence: async (modelId) => {
      const response = await api.get(`model/getSequence/${modelId}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    updateCardListSequence: async (body) => {
      const response = await api.post("model/updateCardListSequence", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          // enqueueSnackbar(`Updated List orders!`, { variant: 'success' });
          return true;
        } else {
          enqueueSnackbar(`Error updating of orders!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    updateCard: async (body) => {
      const response = await api.post("model/updateCard", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated card orders!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of orders!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    archiveList: async (body) => {
      const response = await api.post(
        "model/archiveList",
        JSON.stringify(body)
      );
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Archived list!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error Archiving list!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    archiveCard: async (body) => {
      const response = await api.post(
        "model/archiveCard",
        JSON.stringify(body)
      );
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Archived card!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error Archiving card!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    updateCardInListSequence: async (body) => {
      const response = await api.post("model/updateCardInListSequence", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          // enqueueSnackbar(`Updated List orders!`, { variant: 'success' });
          return true;
        } else {
          enqueueSnackbar(`Error updating of orders!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    renameList: async (body) => {
      const response = await api.post("model/renameList", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated name list!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of orders!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    sendTicketCardComment: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/sendTicketCardComment", body);
      let data = await response.json();
      if (response.status === 200) {
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Comment!`, { variant: "error" });
        return;
      }
    },
    getCardActivities: async (id) => {
      const response = await api.get(`model/getCardActivities/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      }
    },

    updateCardInfo: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/updateCardInfo", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Success update!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    sendTicketCardStatus: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/sendTicketCardStatus", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated status!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },

    sendticketCardMembers: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/sendticketCardMembers", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Updated card info!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    geticketCardMembers: async (id) => {
      const response = await api.get(`model/geticketCardMembers/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      }
    },
    addPO: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/addPO", body);
      let data = await response.json();
      console.log(data);
      if (response.status === 200) {
        enqueueSnackbar(`Successfully added new order!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of PO! ${data?.message}`, {
          variant: "error",
        });
        return;
      }
    },
    gePO: async (postData) => {
      const body = JSON.stringify(postData);
      const response = await api.post("model/gePO", body);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of Projects!`, { variant: "error" });
        return;
      }
    },
    getPoDetails: async (id) => {
      const response = await api.get(`model/getPoDetails/${id}`);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      }
    },
    acknowledgeOrders: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/acknowledgeOrders", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Success update!`, { variant: "success" });
          return true;
        } else {
          enqueueSnackbar(`Error updating of status!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    getSpaces: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post(`model/getSpaces`, body);
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    getProjectConsumableLogs: async (modelId) => {
      const response = await api.get(
        `model/getProjectConsumableLogs/${modelId}`
      );
      let data = await response.json();
      if (response.status === 200) {
        let _decodeData = await _helpers._return(data);
        return _decodeData.apiRet;
      } else {
        enqueueSnackbar(`Error retrieving of staff!`, { variant: "error" });
        return;
      }
    },
    uploadFile: async (postData) => {
      const response = await api.upload("upload/uploadFile", postData);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully upploaded file!`, { variant: "success" });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of PO!`, { variant: "error" });
        return;
      }
    },
    uploadSignature: async (postData) => {
      const response = await api.upload("upload/uploadSignature", postData);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully upploaded Signature!`, {
          variant: "success",
        });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of Signature!`, { variant: "error" });
        return;
      }
    },
    uploadTicketFile: async (postData) => {
      const response = await api.upload("upload/uploadTicketFile", postData);
      let data = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(`Successfully upploaded file!`, { variant: "success" });
        return _helpers._return(data);
      } else {
        enqueueSnackbar(`Error adding of PO!`, { variant: "error" });
        return;
      }
    },
    deleteAttachment: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/deleteAttachment", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          enqueueSnackbar(`Attachment successfully deleted!`, {
            variant: "success",
          });
          return true;
        } else {
          enqueueSnackbar(`Error deleeting of file!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    deleteComment: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/deleteComment", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          // enqueueSnackbar(`AttaCchment successfully deleted!`, { variant: 'success' });
          return true;
        } else {
          enqueueSnackbar(`Error deleeting of file!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    deleteTicketComment: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/deleteTicketComment", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          // enqueueSnackbar(`AttaCchment successfully deleted!`, { variant: 'success' });
          return true;
        } else {
          enqueueSnackbar(`Error deleeting of file!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    updateComment: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/updateComment", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          // enqueueSnackbar(`Attachment successfully deleted!`, { variant: 'success' });
          return true;
        } else {
          enqueueSnackbar(`Error deleeting of file!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
    updateTicketComment: async (bodyData) => {
      const body = JSON.stringify(bodyData);
      const response = await api.post("model/updateTicketComment", body);
      if (response.status === 200) {
        let data = await response.json();
        let _data = await _helpers._return(data);
        if (_data.status) {
          // enqueueSnackbar(`Attachment successfully deleted!`, { variant: 'success' });
          return true;
        } else {
          enqueueSnackbar(`Error deleeting of file!`, { variant: "error" });
          return false;
        }
      } else {
        enqueueSnackbar(`Error: 401!`, { variant: "error" });
        return 401;
      }
    },
  };
};

export default ProjectLogic;
