import React from 'react'
import { Redirect } from 'react-router-dom'
import dashboardRoutes from './modules/dashboard/DashboardRoutes'

const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/projects/list" />,
    },
]

const errorRoute = [
    {
        component: () => <Redirect to="/session/404" />,
    },
]

const routes = [
    // ...dashboardRoutes,
    ...redirectRoute,
    ...errorRoute,
]

export default routes
