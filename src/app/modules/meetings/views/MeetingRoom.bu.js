import React, { useEffect, useState } from 'react';
import { api } from 'app/services/api';
import MeetingLogic from '../logic/MeetingLogic';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, NavLink } from 'react-router-dom'

import ZoomMtgEmbedded from "@zoomus/websdk/embedded";
let meetingSDKElement = document.getElementById('meetingSDKElement');

const MeetingRoom = (props) => {
    const client = ZoomMtgEmbedded.createClient();

    const _logic = MeetingLogic();
    const [created, setCreated] = useState(true);
    const [meetingCreds, setmeetingCreds] = useState({});
    const { pathname } = useLocation()
    const { user } = useSelector(state => state.usercontext)
    const { meetingNumber } = props;
    const role = 1;
    var leaveUrl = window.location.origin + '/meetings/list';

    useEffect(() => {
        getMeeting();
    }, []);


    const getMeeting = async () => {
        const meetingId = pathname.split('/');
        const body = { meetingId: meetingId[2] }
        const response = await _logic.getMeeting(body);
        const { start_url, join_url, password, id } = response.data
        if (response) {
            let zoom_url = user.role === "Admin" ? start_url : join_url;
            let role = user.role === "Admin" ? 1 : 0;

            const body = JSON.stringify({
                meetingNumber: id,
                role: 1,
                sessionName: "Sol59 Meeting",
                userIdentity: "gevie",
                user: "geviepitogo@gmail.com"
            })
            const responseSig = await _logic.generateMeetingSig(body);
            console.log('responseSig', responseSig);
            if (responseSig) {
                const sig = responseSig.signature
                setmeetingCreds({
                    apiKey: process.env.REACT_APP_ZOOM_JWT_API_KEY,
                    signature: sig,
                    meetingNumber: id,
                    userName: `${user.firstname} ${user.lastname}`,
                    userEmail: `${user.email}`,
                    passWord: password,
                    tk: '',
                })

                startMeeting({
                    apiKey: process.env.REACT_APP_ZOOM_JWT_API_KEY,
                    signature: sig,
                    meetingNumber: id,
                    userName: `${user.firstname} ${user.lastname}`,
                    userEmail: `${user.email}`,
                    passWord: password,
                    tk: '',
                })
            }
        }
    }


    function startMeeting(data) {
        const rootElement = document.getElementById("meetingSDKElement");

        // Set your init parameters
        const initParams = {
            zoomAppRoot: rootElement,

        };

        // Set your join params
        const joinParams = {
            apiKey: data.apiKey,

        };


        // Join the meeting
        client
            .join(joinParams)
            .then((e) => {
                console.log('success',e);
            })
            .catch((e) => {
                console.log('error',e);
            });



        // ZoomMtg.init({
        //     leaveUrl: leaveUrl,
        //     isSupportAV: true,
        //     success: (success) => {
        //         console.log('----success',success)

        //         ZoomMtg.join({
        //             signature: data.signature,
        //             meetingNumber: data.meetingNumber,
        //             userName: data.userName,
        //             apiKey: data.apiKey,
        //             userEmail: data.userEmail,
        //             passWord: data.passWord,
        //             success: (success) => {
        //                 console.log('success',success)
        //             },
        //             error: (error) => {
        //                 console.log('error',error)
        //             }
        //         })

        //     },
        //     error: (error) => {
        //         console.log(error)
        //     }
        // })
    }

    console.log('meetingCreds', meetingCreds);

    return (
        <div >

        </div>
    );
};

export default MeetingRoom;