import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const ProjectsLists = Loadable(lazy(() => import("./views/ProjectsLists")));
const Information = Loadable(lazy(() => import("./views/Information")));
const Matterport = Loadable(lazy(() => import("./views/Matterport")));
const Test = Loadable(lazy(() => import("./views/Test")));

const ProjectsRoutes = [
    {
        path: '/projects/list',
        element: <ProjectsLists />,
    },
    {
        path: '/view-project/:id',
        element: <Matterport />,
    },
    {
        path: '/project-info/:id',
        element: <Information />,
    },
    {
        path: '/test/:id',
        element: <Test />,
    }
]

export default ProjectsRoutes
