import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const Consumables = Loadable(lazy(() => import("./views/Consumables")));
const ConsumablesRoutes = [
    {
        path: '/consumables',
        element: <Consumables />
    }
]

export default ConsumablesRoutes
