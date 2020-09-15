import React, {
    useState,
    useEffect,
    useRef
} from 'react'

import MapView from '../MapView/MapView';
import Sidebar from '../Sidebar/Sidebar';
import SearchWidget from '../SearchWidget/SearchWidget';
import AirQualityIndicator from '../AirQualityIndicator/AirQualityIndicator';
import WindspeedChart from '../WindspeedChart/WindspeedChart';

import AppConfig from '../../AppConfig';

import {
    QueryLocation,
    AirQualityForecast,
    WindSpeedLayerFeature
} from 'air-quality-aware';

import {
    queryAirQualityData
} from '../../utils/queryAirQualityData';

import {
    queryWindSpeedData
} from '../../utils/queryWindSpeedData';

const App = () => {

    const searchWidgetContainerRef = useRef<HTMLDivElement>();
    const [ airQualityForecast, setAirQualityForecast ] = useState<AirQualityForecast>();
    const [ windspeedForecast, setWindspeedForecast ] = useState<WindSpeedLayerFeature[]>()

    const queryAppData = async(location:QueryLocation)=>{
        const airQualityForecastData = await queryAirQualityData(location);
        setAirQualityForecast(airQualityForecastData);

        const windSpeedData = await queryWindSpeedData(location);
        setWindspeedForecast(windSpeedData);
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

                <WindspeedChart 
                    data={windspeedForecast}
                />

            </Sidebar>
        </div>
    )
}

export default App
