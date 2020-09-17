import React, {
    useState,
    useEffect
} from 'react'

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IGraphic from 'esri/Graphic';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import IPoint from 'esri/geometry/Point'
import ISimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol"
import { QueryLocation } from 'air-quality-aware';
import { UIConfig } from '../../AppConfig';

type Props = {
    queryResult: QueryLocation;
    mapView?: IMapView;
};

const QueryLocationPoint: React.FC<Props>  = ({
    queryResult,
    mapView 
}) => {
    const [graphicLayer, setGraphicLayer] = useState<IGraphicsLayer>();

    const init = async () => {
        type Modules = [typeof IGraphicsLayer];

        try {
            const [GraphicsLayer] = await (loadModules([
                'esri/layers/GraphicsLayer',
            ]) as Promise<Modules>);

            const layer = new GraphicsLayer();

            mapView.map.add(layer);

            setGraphicLayer(layer);
        } catch (err) {
            console.error(err);
        }
    };

    const showQueryResult = async () => {
        type Modules = [
            typeof IGraphic,
            typeof IPoint,
            typeof ISimpleMarkerSymbol
        ];

        const [Graphic, Point, SimpleMarkerSymbol ] = await (loadModules([
            'esri/Graphic',
            'esri/geometry/Point',
            'esri/symbols/SimpleMarkerSymbol',
        ]) as Promise<Modules>);

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
