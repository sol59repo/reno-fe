import { combineReducers } from 'redux'
import NotificationReducer from './NotificationReducer'
import NavigationReducer from './NavigationReducer'
import staffsReducer from './staffsReducer'
import userContextReducer from './userContextReducer'
import meetingReducer from './meetingReducer'
import projectReducer from './projectReducer'
import commonReducer from './commonReducer'
import consumablesReducer from './consumableReducer'


const RootReducer = combineReducers({
    notifications: NotificationReducer,
    navigations: NavigationReducer,
    staffs: staffsReducer,
    usercontext: userContextReducer,
    meetings: meetingReducer,
    projects: projectReducer,
    common: commonReducer,
    consumables: consumablesReducer,
})

export default RootReducer
