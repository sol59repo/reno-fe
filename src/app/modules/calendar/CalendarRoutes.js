import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const MatxCalendar = Loadable(lazy(() => import("./views/MatxCalendar")));


const calendarRoutes = [
    {
        path: '/calendar',
        element: <MatxCalendar />,
    }
]

export default calendarRoutes
