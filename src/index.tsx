import './styles/index.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import AppContextProvider from './contexts/AppContextProvider';
import App from './components/App/App';

// import { setDefaultOptions } from 'esri-loader';

// setDefaultOptions({
//     url: 'https://js.arcgis.com/next/'
// });

const root = createRoot(document.getElementById('root'));

root.render(
    <AppContextProvider>
        <App />
    </AppContextProvider>
);