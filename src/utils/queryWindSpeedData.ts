import axios from 'axios';
import AppConfig from '../AppConfig';

import {
    QueryLocation,
    WindSpeedLayerFeature
} from 'air-quality-aware';

export const queryWindSpeedData = async(queryLocation:QueryLocation):Promise<WindSpeedLayerFeature[]>=>{

    const serviceUrl = AppConfig["wind-speed-forecast-service"];

    const params = {
        f: 'json',
        outFields: 'force,fromdate,todate,label',
        geometry: JSON.stringify(queryLocation),
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: 'false',
        orderByFields: 'fromdate' 
    }

    const resCurrent = await axios(`${serviceUrl}/query`, { params });

    const features:WindSpeedLayerFeature[] = resCurrent.data && resCurrent.data.features && resCurrent.data.features.length
        ? resCurrent.data.features
        : undefined;
    console.log(features);

    return features;
}