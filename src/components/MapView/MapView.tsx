import React, {
    useContext
} from 'react';

import { loadModules, loadCss } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import ILocateWidget from "esri/widgets/Locate";
import IHomeWidget from "esri/widgets/Home"

import { AppContext } from '../../contexts/AppContextProvider';

import { UIConfig } from '../../AppConfig';

import {
    QueryLocation
} from 'air-quality-aware';

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

    const [ mapView, setMapView] = React.useState<IMapView>(null);

    const initMapView = async()=>{
        
        type Modules = [typeof IMapView, typeof IWebMap];

        try {
            const [ 
                MapView, 
                WebMap 
            ] = await (loadModules([
                'esri/views/MapView',
                'esri/WebMap',
            ]) as Promise<Modules>);

            const view = new MapView({
                container: mapDivRef.current,
                map: new WebMap({
                    portalItem: {
                        id: webmapId
                    }  
                }),
                padding: {
                    right: !isMobile ? UIConfig["sidebar-width"] : 0
                }
            });

            view.when(()=>{
                setMapView(view);
            });

        } catch(err){   
            console.error(err);
        }
    };

    const initEventListeners = () => {
        mapView.on('click', (event) => {
            const mapPoint = event.mapPoint.toJSON() as QueryLocation;
            onClickHandler(mapPoint);
        });
    };

    const initWidgets = async()=>{

        type Modules = [typeof ILocateWidget, typeof IHomeWidget];

        try {
            const [ 
                Locate, 
                Home 
            ] = await (loadModules([
                'esri/widgets/Locate',
                "esri/widgets/Home",
            ]) as Promise<Modules>);

            const locateWidget = new Locate({
                view: mapView,   // Attaches the Locate button to the view
            });

            const homeWidget = new Home({
                view: mapView
            });

            mapView.ui.add(locateWidget, "top-left");

            mapView.ui.add(homeWidget, "top-left");

        } catch(err){   
            console.error(err);
        }
    };

    React.useEffect(()=>{
        loadCss();
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