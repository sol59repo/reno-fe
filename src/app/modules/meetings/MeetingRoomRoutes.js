import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';
// const MeetingRoom = Loadable(lazy(() => import("./views/MeetingRoom")));
import MeetingRoom from './views/MeetingRoom';

const MeetingsRoomRoutes = [
    {
        path: '/meeting-room/:id',
        element: <MeetingRoom />,
    },
]

export default MeetingsRoomRoutes
