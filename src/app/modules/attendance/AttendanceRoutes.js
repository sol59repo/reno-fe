import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const AttendanceLists = Loadable(lazy(() => import("./views/AttendanceLists")));
const AttendanceRoutes = [
    {
        path: '/attendance/list',
        element: <AttendanceLists />,
    }
]

export default AttendanceRoutes
