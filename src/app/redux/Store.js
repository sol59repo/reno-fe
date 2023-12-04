import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import RootReducer from './reducers/RootReducer'

import localforage from 'localforage';
import { configureStore } from '@reduxjs/toolkit';


const persistConfig = {
    key: 'root',
    whitelist: ['usercontext'],// persisted reducer
    storage: localforage,
}


const persistedReducer = persistReducer(persistConfig, RootReducer)

export const Store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
});


export const persistor = persistStore(Store)
