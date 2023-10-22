import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import RootReducer from './reducers/RootReducer'
import storage from 'redux-persist/lib/storage' 

const initialState = {}
const middlewares = [thunk]
let devtools = (x) => x

if (
    process &&
    process.env.NODE_ENV !== 'production' &&
    process.browser &&
    window.__REDUX_DEVTOOLS_EXTENSION__
) {
    devtools = window.__REDUX_DEVTOOLS_EXTENSION__()
}


const persistConfig = {
    key: 'root',
    whitelist: ['usercontext'],// persisted reducer
    storage
}


const persistedReducer = persistReducer(persistConfig, RootReducer)


export const Store = createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middlewares), devtools)
)


export const persistor = persistStore(Store)
