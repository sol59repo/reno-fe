import React, { useEffect, useState } from 'react';
import ZoomMtgEmbedded from "@zoomus/websdk/embedded";
import { api } from 'app/services/api';
import MeetingLogic from '../logic/MeetingLogic';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, NavLink } from 'react-router-dom'


const rootElement: HTMLElement = document.getElementById(
  "ZoomEmbeddedApp"
) as HTMLElement;

declare global {
  interface Window {
    testTool: any;
  }
}


const MeetingRoom = (props: any) => {
  const _logic = MeetingLogic();

  const { pathname } = useLocation()
  const { user } = useSelector((state: any) => state.usercontext)
  var leaveUrl = window.location.origin + '/meetings/list';

  useEffect(() => {
    getMeeting();
  }, []);


  const getMeeting = async () => {
    const meetingId = pathname.split('/');
    const body = { meetingId: meetingId[2] }
    const response = await _logic.getMeeting(body);
    const { password, id } = response.data
    console.log(response.data);
    if (response) {
      let role = user.role === "Admin" ? 1 : 0;
      const body = JSON.stringify({
        meetingNumber: id,
        role: role,
      })
      const responseSig = await _logic.generateMeetingSig(body);
      console.log('responseSig', responseSig);
      if (responseSig) {
        const sig = responseSig.signature
         startMeeting(sig, id, password);
      }
    }
  }

  const startMeeting =  (signature: string, meetingId: string, password: string) => {
    const testTool = window.testTool;
    const zmClient = ZoomMtgEmbedded.createClient();

    const tmpPort = window.location.port === "" ? "" : ":" + window.location.port;
    const avLibUrl =
      window.location.protocol +
      "//" +
      window.location.hostname +
      tmpPort +
      "/lib";

    zmClient
      .init({
        debug: true,
        zoomAppRoot: rootElement,
        language: "en-US",
      })
      .then((e: any) => {
      })
      .catch((e: any) => {
        console.log("init error", e);
      });

    zmClient
      .join({
        apiKey: process.env.REACT_APP_ZOOM_JWT_API_KEY,
        signature: signature,
        meetingNumber: meetingId,
        userName: `${user.firstname} ${user.lastname}`,
        password: password,
        userEmail: `${user.email}`
      })
      .then((e: any) => {
        console.log("join success", e);
      })
      .catch((e: any) => {
        console.log("join error", e);
      });

  }

  return (
    <div>

    </div>
  );
};

export default MeetingRoom;

