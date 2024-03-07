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
import ReverseGeocodingResultText from '../ReverseGeocodingResultText/ReverseGeocodingResultText';
import QueryLocationPoint from '../QueryLocationPoint/QueryLocationPoint';

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

import {
    ReverseGeocodingResult,
    reverseGeocode
} from '../../utils/reverseGeocoding'

const App = () => {

    const searchWidgetContainerRef = useRef<HTMLDivElement>();
    const [ airQualityForecast, setAirQualityForecast ] = useState<AirQualityForecast>();
    const [ windspeedForecast, setWindspeedForecast ] = useState<WindSpeedLayerFeature[]>();
    const [ populationData, setPopulationData ] = useState<PopulationData>();
    const [ isAboutModalOpen, setIsAboveModalOpen ] = useState<boolean>();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isSidebarContentVisible, setIsSidebarContentVisible ] = useState<boolean>(true);
    const [ reverseGeocodingResult, setReverseGeocodingResult ] = useState<ReverseGeocodingResult>();
    const [ queryLocation, setQueryLocation] = useState<QueryLocation>();
    const [ isSideBarExpanded, setIsSidebarExpanded ] = useState<boolean>();

    const [queryError, setQueryError] = useState<Error>(null)

    const queryAppData = async(location:QueryLocation)=>{

        if(!isSideBarExpanded){
            setIsSidebarExpanded(true);
        }
        
        setAirQualityForecast(undefined);
        setWindspeedForecast(undefined);
        setPopulationData(undefined);
        setIsLoading(true);
        setReverseGeocodingResult(undefined);
        setQueryLocation(location);

        try {
            const reverseGeocodingResult = await reverseGeocode(location);
            setReverseGeocodingResult(reverseGeocodingResult);

            if(!reverseGeocodingResult.error){

                const airQualityForecastData = await queryAirQualityData(location);
                const windSpeedData = await queryWindSpeedData(location);
                const populationData = await queryPopulationData(location);
    
                // open sidebar first in mobile view before rendering components inside of it
                setIsSidebarContentVisible(true);
                
                setAirQualityForecast(airQualityForecastData);
                setWindspeedForecast(windSpeedData);
                setPopulationData(populationData);
            }

        } catch(err){
            console.log(err);
            setQueryError(err);
        }

        setIsLoading(false);
    }

    useEffect(()=>{

        // reset error from previous query once the data is getting loaded again
        if(isLoading){
            setQueryError(null);
        }

    }, [isLoading])

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

                <QueryLocationPoint 
                    queryResult={queryLocation}
                />
            </MapView>

            <Sidebar
                isExpanded={isSideBarExpanded}
                isContentVisible={isSidebarContentVisible}
                toggleBtnOnclick={setIsSidebarContentVisible}
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

                {
                    queryError ? (
                        <div 
                            style={{
                                textAlign: 'center',
                                padding: '1rem 0'
                            }}
                        >
                            <p>{queryError?.message || 'Failed to fetch data'}</p>
                        </div>
                    ) : (
                        <>
                            <ReverseGeocodingResultText 
                                data={reverseGeocodingResult}
                            />

                            <AirQualityIndicator 
                                data={airQualityForecast}
                            />

                            <WindspeedChart 
                                data={windspeedForecast}
                            />

                            <PopulationInfo 
                                data={populationData}
                            />
                        </>
                    )
                }

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
