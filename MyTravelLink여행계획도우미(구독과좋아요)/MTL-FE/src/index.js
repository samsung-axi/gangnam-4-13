import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './Store';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

export let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);
