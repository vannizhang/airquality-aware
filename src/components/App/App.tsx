import React from 'react'

import MapView from '../MapView/MapView';
import Sidebar from '../Sidebar/Sidebar';

import AppConfig from '../../AppConfig';

const App = () => {
    return (
        <div>
            <MapView 
                webmapId={AppConfig["webmap-id"]}
            />

            <Sidebar>
                
            </Sidebar>
        </div>
    )
}

export default App
