import './styles/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import AppContextProvider from './contexts/AppContextProvider';
import App from './components/App/App';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root container not found');
}

const root = createRoot(container);

root.render(
    <React.StrictMode>
        <AppContextProvider>
            <App />
        </AppContextProvider>
    </React.StrictMode>
);