import React, {
    useState,
    useEffect,
    useRef
} from 'react'

import MapView from '../MapView/MapView';
import Sidebar from '../Sidebar/Sidebar';
import SearchWidget from '../SearchWidget/SearchWidget';
import AirQualityIndicator from '../AirQualityIndicator/AirQualityIndicator';

import AppConfig from '../../AppConfig';

import {
    QueryLocation,
    AirQualityForecast
} from 'air-quality-aware';

import {
    queryAirQualityData
} from '../../utils/queryAirQualityData';

const App = () => {

    const searchWidgetContainerRef = useRef<HTMLDivElement>();
    const [ airQualityForecast, setAirQualityForecast ] = useState<AirQualityForecast>()

    const queryAppData = async(location:QueryLocation)=>{
        const airQualityForecastData = await queryAirQualityData(location);
        setAirQualityForecast(airQualityForecastData);
    }

    return (
        <div>
            <MapView 
                webmapId={AppConfig["webmap-id"]}
                onClickHandler={queryAppData}
            >
                <SearchWidget 
                    containerRef={searchWidgetContainerRef}
                    searchCompletedHandler={queryAppData}
                />
            </MapView>

            <Sidebar>

                <div 
                    ref={searchWidgetContainerRef}
                    style={{
                        'width': '100%',
                        'marginBottom': '1rem'
                    }}
                ></div>

                <AirQualityIndicator 
                    data={airQualityForecast}
                />

            </Sidebar>
        </div>
    )
}

export default App
