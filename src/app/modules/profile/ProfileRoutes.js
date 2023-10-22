import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const Info = Loadable(lazy(() => import("./views/Info")));
const ProfileRoutes = [
    {
        path: '/profile/:id',
        element: <Info />,
    },
]

export default ProfileRoutes
