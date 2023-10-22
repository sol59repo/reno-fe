import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const MeetingsLists = Loadable(lazy(() => import("./views/MeetingsLists")));
// const MeetingRoom = Loadable(lazy(() => import("./views/MeetingRoom")));

const meetingsRoutes = [
    {
        path: '/meetings/list',
        element: <MeetingsLists />,
    },
    // {
    //     path: '/meeting-room/:id',
    //     element: <MeetingRoom />,
    // },
]

export default meetingsRoutes
