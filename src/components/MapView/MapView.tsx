import React, {
    useContext
} from 'react';

import { loadModules, loadCss } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";

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
                    right: !isMobile ? UIConfig["sidebar-width"] : undefined
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

    React.useEffect(()=>{
        loadCss();
        initMapView();
    }, []);

    
    React.useEffect(()=>{
        if(mapView){
            initEventListeners();
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