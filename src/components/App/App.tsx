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
import PopulationInfo from '../PopulationInfo/PopulationInfo';
import About from '../AboutModal/AboutModal';

import AppConfig from '../../AppConfig';

import {
    QueryLocation,
    AirQualityForecast,
    WindSpeedLayerFeature,
    PopulationData
} from 'air-quality-aware';

import {
    queryAirQualityData
} from '../../utils/queryAirQualityData';

import {
    queryWindSpeedData
} from '../../utils/queryWindSpeedData';

import {
    queryPopulationData
} from '../../utils/queryPopulationData';

const App = () => {

    const searchWidgetContainerRef = useRef<HTMLDivElement>();
    const [ airQualityForecast, setAirQualityForecast ] = useState<AirQualityForecast>();
    const [ windspeedForecast, setWindspeedForecast ] = useState<WindSpeedLayerFeature[]>();
    const [ populationData, setPopulationData ] = useState<PopulationData>();
    const [ isAboutModalOpen, setIsAboveModalOpen ] = useState<boolean>();

    const queryAppData = async(location:QueryLocation)=>{
        const airQualityForecastData = await queryAirQualityData(location);
        setAirQualityForecast(airQualityForecastData);

        const windSpeedData = await queryWindSpeedData(location);
        setWindspeedForecast(windSpeedData);

        const populationData = await queryPopulationData(location);
        setPopulationData(populationData);
    }

    return (
        <>
            <MapView 
                webmapId={AppConfig["webmap-id"]}
                onClickHandler={queryAppData}
            >
                <SearchWidget 
                    containerRef={searchWidgetContainerRef}
                    searchCompletedHandler={queryAppData}
                />
            </MapView>

            <Sidebar
                infoBtnOnClick={setIsAboveModalOpen.bind(this, true)}
            >

                <div 
                    ref={searchWidgetContainerRef}
                    style={{
                        'width': '100%',
                        'marginBottom': '1rem'
                    }}
                    className='search-widget-container'
                ></div>

                <AirQualityIndicator 
                    data={airQualityForecast}
                />

                <WindspeedChart 
                    data={windspeedForecast}
                />

                <PopulationInfo 
                    data={populationData}
                />

            </Sidebar>

            <About 
                isOpen={isAboutModalOpen}
                onCloseHandler={setIsAboveModalOpen.bind(this, false)}
            />
        </>
    )
}

export default App
