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
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isSidebarOpen, setIsSidebarOpen ] = useState<boolean>(true)

    const queryAppData = async(location:QueryLocation)=>{

        setAirQualityForecast(undefined);
        setWindspeedForecast(undefined);
        setPopulationData(undefined);

        setIsLoading(true);

        try {
            const airQualityForecastData = await queryAirQualityData(location);
            const windSpeedData = await queryWindSpeedData(location);
            const populationData = await queryPopulationData(location);

            // open sidebar first in mobile view before rendering components inside of it
            setIsSidebarOpen(true);
            setIsLoading(false);

            setAirQualityForecast(airQualityForecastData);
            setWindspeedForecast(windSpeedData);
            setPopulationData(populationData);

        } catch(err){
            setIsLoading(false);
            console.log(err);
        }
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
                isOpen={isSidebarOpen}
                toggleBtnOnclick={setIsSidebarOpen}
                infoBtnOnClick={setIsAboveModalOpen.bind(this, true)}
                isLoading={isLoading}
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

                {
                    isLoading ? (
                        <div className="loader is-active padding-leader-3 padding-trailer-3">
                            <div className="loader-bars"></div>
                            <div className="loader-text">Loading...</div>
                        </div>
                    ) : null
                }

            </Sidebar>

            <About 
                isOpen={isAboutModalOpen}
                onCloseHandler={setIsAboveModalOpen.bind(this, false)}
            />
        </>
    )
}

export default App
