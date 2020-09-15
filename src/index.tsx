import './styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import AppContextProvider from './contexts/AppContextProvider';
import App from './components/App/App';

import { setDefaultOptions } from 'esri-loader';

setDefaultOptions({
    url: 'https://js.arcgis.com/next/'
});

ReactDOM.render(
    <AppContextProvider>
        <App />
    </AppContextProvider>,
    document.getElementById('root')
);