import React, {
    useContext
} from 'react';

// import { loadModules, loadCss } from 'esri-loader';
import ArcGISMapView from '@arcgis/core/views/MapView';
import WebMap from "@arcgis/core/WebMap";
import Locate from "@arcgis/core/widgets/Locate";
import Home from "@arcgis/core/widgets/Home";
// import IwatchUtils from 'esri/core/watchUtils';
import { watch } from '@arcgis/core/core/reactiveUtils';

import { AppContext } from '../../contexts/AppContextProvider';

import { UIConfig } from '../../AppConfig';

import {
    QueryLocation
} from 'air-quality-aware';

import {
    saveMapLocationInUrlHashParams,
    getMapLocationFromUrlHashParams,
    MapCenterLocation
} from '../../utils/UrlHashParams';

// loadCss();

type Props = {
    webmapId: string;
    onClickHandler: (data:QueryLocation)=>void;
};

const MapView:React.FC<Props> = ({
    webmapId,
    onClickHandler,
    children
})=>{

    const { isMobile } = useContext(AppContext)

    const mapDivRef = React.useRef<HTMLDivElement>();

    const [ mapView, setMapView] = React.useState<ArcGISMapView>(null);

    const initMapView = async()=>{
        
        const defaultMapLocation = getMapLocationFromUrlHashParams();

        const view = new ArcGISMapView({
            container: mapDivRef.current,
            map: new WebMap({
                portalItem: {
                    id: webmapId
                }  
            }),
            padding: {
                right: !isMobile ? UIConfig["sidebar-width"] : 0
            },
            zoom: defaultMapLocation ?  defaultMapLocation.zoom : undefined,
            center: defaultMapLocation ? [ defaultMapLocation.lon, defaultMapLocation.lat ] : undefined
        });

        view.when(()=>{
            setMapView(view);
        });

    };

    const initEventListeners = async() => {

        mapView.on('click', (event) => {

            const {
                spatialReference,
                x,
                y,
                longitude,
                latitude
            } = event.mapPoint

            const mapPoint = {
                spatialReference: spatialReference.toJSON(),
                x,
                y,
                longitude,
                latitude
            } as QueryLocation;

            onClickHandler(mapPoint);
        });

        // type Modules = [typeof IwatchUtils];

        watch(
            () => mapView.stationary,
            (stationary) => {
                // console.log('mapview is stationary', mapView.center, mapView.zoom);

                if(!stationary){
                    return;
                }

                if (mapView.zoom === -1) {
                    return;
                }

                const centerLocation: MapCenterLocation = {
                    lat:
                        mapView.center && mapView.center.latitude
                            ? +mapView.center.latitude.toFixed(3)
                            : 0,
                    lon:
                        mapView.center && mapView.center.longitude
                            ? +mapView.center.longitude.toFixed(3)
                            : 0,
                    zoom: mapView.zoom,
                };

                saveMapLocationInUrlHashParams(centerLocation);
            });
    };

    const initWidgets = async()=>{

        const locateWidget = new Locate({
            view: mapView,   // Attaches the Locate button to the view
        });

        const homeWidget = new Home({
            view: mapView
        });

        mapView.ui.add(locateWidget, "top-left");

        mapView.ui.add(homeWidget, "top-left");
    };

    React.useEffect(()=>{
        initMapView();
    }, []);

    
    React.useEffect(()=>{
        if(mapView){
            initEventListeners();
            initWidgets();
        }
    }, [mapView]);

    return (
        <>
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                ref={mapDivRef}
            ></div>
            { 
                React.Children.map(children, (child)=>{
                    return React.cloneElement(child as React.ReactElement<any>, {
                        mapView,
                    });
                }) 
            }
        </>
    );
};

export default MapView;