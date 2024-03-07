import React, {
    useState,
    useEffect
} from 'react'

// import { loadModules } from 'esri-loader';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point'
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol"
import { QueryLocation } from 'air-quality-aware';
import { UIConfig } from '../../AppConfig';

type Props = {
    queryResult: QueryLocation;
    mapView?: MapView;
};

const QueryLocationPoint: React.FC<Props>  = ({
    queryResult,
    mapView 
}) => {
    const [graphicLayer, setGraphicLayer] = useState<GraphicsLayer>();

    const init = async () => {

        const layer = new GraphicsLayer();

        mapView.map.add(layer);

        setGraphicLayer(layer);
    };

    const showQueryResult = async () => {
        // type Modules = [
        //     typeof IGraphic,
        //     typeof IPoint,
        //     typeof ISimpleMarkerSymbol
        // ];

        // const [Graphic, Point, SimpleMarkerSymbol ] = await (loadModules([
        //     'esri/Graphic',
        //     'esri/geometry/Point',
        //     'esri/symbols/SimpleMarkerSymbol',
        // ]) as Promise<Modules>);

        const graphic = new Graphic({
            geometry: new Point(queryResult),
            symbol: new SimpleMarkerSymbol({
                color: UIConfig["indicator-color"],
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: 'rgba(255,255,255,0)',
                    width: 1,
                },
            })
        });

        graphicLayer.add(graphic);
    };

    useEffect(() => {
        if (mapView) {
            init();
        }
    }, [mapView]);

    useEffect(() => {
        if (graphicLayer) {
            graphicLayer.removeAll();

            if (queryResult) {
                showQueryResult();
            }
        }
    }, [queryResult]);

    return null;

}

export default QueryLocationPoint
