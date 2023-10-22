import React, { useState, useEffect } from "react";
import { Container } from "../../../commons/StyledEl";
import { Box } from "@mui/system";
import { Breadcrumb } from "app/components";
import { Tab, Tabs, Divider, Grid } from "@mui/material";
import Staffs from "../comps/info/Staffs";
import Managers from "../comps/info/Managers";
import Materials from "../comps/info/Materials";
import Attendance from "../comps/info/Attendance";
import Model from "../comps/info/Model";
import CommonLogic from "app/logic/CommonLogic";
import ProjectLogic from "../logic/ProjectLogic";
import Ticket from "../comps/info/Ticket";

const Information = (props) => {
  const _commonLogic = CommonLogic();
  const _logic = ProjectLogic();
  const [tabIndex, setTabIndex] = useState(0);
  const [projectInfo, setProjectInfo] = useState([{ location: "" }]);
  const { location } = projectInfo[0];

  const path = _commonLogic.getUrlPath();
  const modelId = path[2];

  const handleTabChange = (e, value) => {
    setTabIndex(value);
  };

  useEffect(async () => {
    const response = await _logic.getProject(modelId);
    setProjectInfo(response);
  }, []);

  const renderTabs = () => {
    const tabList = [
      "Staff",
      "Managers",
      "Materials",
      "Attendance",
      "Model",
      "Documentations",
    ];
    const _tabs = tabList.map((item, ind) => (
      <Tab
        key={ind}
        value={ind}
        label={item}
        sx={{ textTransform: "capitalize" }}
      />
    ));
    return _tabs;
  };

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Projects", path: `/projects/list` },
            { name: location },
          ]}
        />
      </div>

      <Tabs
        TabIndicatorProps={{ sx: { display: "none" } }}
        sx={{
          "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
          },
          mt: 2,
        }}
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        {renderTabs()}
      </Tabs>

      <Divider sx={{ mb: "10px" }} />

      {tabIndex === 0 && (
        <>
          <Staffs />
        </>
      )}

      {tabIndex === 1 && (
        <>
          <Managers />
        </>
      )}

      {tabIndex === 2 && (
        <>
          <Materials projectInfo={projectInfo} />
        </>
      )}

      {tabIndex === 3 && (
        <>
          <Attendance />
        </>
      )}

      {tabIndex === 4 && (
        <>
          <Model />
        </>
      )}

      {tabIndex === 5 && (
        <>
          <Ticket />
        </>
      )}
    </Container>
  );
};

export default Information;
