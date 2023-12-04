import React, { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'axios.js'
import { MatxLoading } from 'app/components'
import { api } from 'app/services/api'
import Helpers from "app/utils/Helpers";
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedData, setIsLogged, setIsInitialize } from 'app/redux/actions/userContextAction'
import { useNavigate } from 'react-router-dom'
import { truncate } from 'lodash'



const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now()
    return decodedToken.exp < currentTime
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}


const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    isInitialised: false,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
    const _helpers = Helpers();
    const _dispatch = useDispatch();
    const _navigate = useNavigate()

    const { isAuthenticated, user, isInitialised } = useSelector(state => state.usercontext);


    const login = async (ID, password) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const body = JSON.stringify({ ID, password });
        const response = await api.auth('login', body);
        let data = await response.json();

        if (response.status !== 200) {
            return {
                message: data.message[0],
                status: false
            }
        } else {

            let decodeData = await _helpers._return(data);
            const { apiRet } = decodeData;
            setSession(apiRet.token)

            console.log('apiRet', apiRet);
            _dispatch(setIsLogged(true));
            _dispatch(setLoggedData({
                ...apiRet,
                role: apiRet.usertype
            }));
            return {
                status: true
            }
        }
    }

    const logout = () => {
        _dispatch(setIsLogged(false));
        _dispatch(setLoggedData(null));
        setSession(null)
    }

    useEffect(() => {
        (async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken')
                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)
                    _dispatch(setIsLogged(true));
                    _dispatch(setIsInitialize(true));
                    // _navigate('/');
                } else {
                    _dispatch(setIsLogged(false));
                    _dispatch(setLoggedData(null));
                    _dispatch(setIsInitialize(true));
                }
            } catch (err) {
                console.error(err)
                _dispatch(setIsLogged(false));
                _dispatch(setLoggedData(null));
                _dispatch(setIsInitialize(true));
            }
        })()
    }, [])

    if (!isInitialised) {
        return <MatxLoading />
    }



    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                isInitialised,
                method: 'JWT',
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
