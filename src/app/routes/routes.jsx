import AuthGuard from 'app/auth/AuthGuard'
import NotFound from 'app/modules/sessions/NotFound'
// import dashboardRoutes from 'app/modules/dashboard/DashboardRoutes'
import sessionRoutes from 'app/modules/sessions/SessionRoutes'
import MatxLayout from '../components/MatxLayout/MatxLayout'
import { Navigate } from 'react-router-dom'

import calendarRoutes from 'app/modules/calendar/CalendarRoutes'
import staffsRoutes from 'app/modules/staffs/StaffRoutes'
import ProjectsRoutes from 'app/modules/projects/ProjectsRoutes'
import AttendanceRoutes from 'app/modules/attendance/AttendanceRoutes'
import meetingsRoutes from 'app/modules/meetings/MeetingsRoutes'
import meetingsRoom from 'app/modules/meetings/MeetingRoomRoutes'
import ConsumablesRoutes from 'app/modules/consumables/ConsumablesRoutes'
import ProfileRoutes from 'app/modules/profile/ProfileRoutes'

export const AllPages = () => {
    const all_routes = [
        {
            element: (
                <AuthGuard>
                    <MatxLayout />
                </AuthGuard>
            ),
            children: [
                // ...dashboardRoutes,
                ...calendarRoutes,
                ...staffsRoutes,
                ...ProjectsRoutes,
                ...AttendanceRoutes,
                ...meetingsRoutes,
                ...ConsumablesRoutes,
                ...ProfileRoutes
            ],
        },
        ...sessionRoutes,
        ...meetingsRoom,
        {
            path: '/',
            element: <Navigate to="/projects/list" />,
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ]

    return all_routes
}
