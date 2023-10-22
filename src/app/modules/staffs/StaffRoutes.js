import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const StaffsLists = Loadable(lazy(() => import("./views/StaffsLists")));
const StaffDetails = Loadable(lazy(() => import("./views/StaffDetails")));
const Info = Loadable(lazy(() => import("./views/Info")));
const staffsRoutes = [
    {
        path: '/employee/list',
        element: <StaffsLists />,
    },
    {
        path: '/view-employee/:id',
        element: <Info />,
    },
]

export default staffsRoutes
