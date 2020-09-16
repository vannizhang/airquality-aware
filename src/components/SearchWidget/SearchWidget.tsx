import './style.scss';
import React from 'react'

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IPoint from 'esri/geometry/Point';
import ISearchWidget from 'esri/widgets/Search';
import { QueryLocation } from 'air-quality-aware';

type Props = {
    mapView?: IMapView,
    containerRef: React.MutableRefObject<HTMLDivElement>
    searchCompletedHandler: (data:QueryLocation)=>void;
}

const SearchWidget:React.FC<Props> = ({
    mapView,
    containerRef,
    searchCompletedHandler
}:Props) => {

    const init = async()=>{

        type Modules = [typeof ISearchWidget];

        try {
            const [ 
                Search, 
            ] = await (loadModules([
                'esri/widgets/Search',
            ]) as Promise<Modules>);

            const searchWidget = new Search({
                view: mapView,
                resultGraphicEnabled: false,
                popupEnabled: false,
                container: containerRef.current
            });

            searchWidget.on('search-complete', evt=>{
                if(searchWidget.results[0] && searchWidget.results[0].results[0]){
                    const searchResultGeom:IPoint = searchWidget.results[0].results[0].feature.geometry;
                    // console.log(searchResultGeom);
                    searchCompletedHandler(searchResultGeom.toJSON())
                }
            })

        } catch(err){   
            console.error(err);
        }
    };

    React.useEffect(()=>{
        if(mapView && containerRef){
            init();
        }
    }, [mapView, containerRef]);

    return null;
}

export default SearchWidget;
