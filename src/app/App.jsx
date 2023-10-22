import '../fake-db'
import React from 'react'
import { Store, persistor } from './redux/Store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { MatxTheme } from 'app/components'
import { AuthProvider } from 'app/contexts/JWTAuthContext'
import { SettingsProvider } from 'app/contexts/SettingsContext'
import AppBody from './AppBody'


const App = () => {
    return (
        <Provider store={Store}>
            <PersistGate loading={null} persistor={persistor}>
                <SettingsProvider>
                    <MatxTheme>
                        <AuthProvider>
                            <AppBody />
                        </AuthProvider>
                    </MatxTheme>
                </SettingsProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
