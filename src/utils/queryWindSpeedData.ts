import axios from 'axios';
import AppConfig from '../AppConfig';

import {
    QueryLocation,
    WindSpeedLayerFeature
} from 'air-quality-aware';

export const queryWindSpeedData = async(queryLocation:QueryLocation):Promise<WindSpeedLayerFeature[]>=>{

    const serviceUrl = AppConfig["wind-speed-forecast-service"];

    const { longitude, latitude } = queryLocation;

    const geometry = {
        x: longitude,
        y: latitude,
        spatialReference: {
            wkid: 4326
        }
    }

    const params = {
        f: 'json',
        outFields: 'force,fromdate,todate,label',
        geometry: JSON.stringify(geometry),
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: 'false',
        orderByFields: 'fromdate' 
    }

    const res = await axios(`${serviceUrl}/query`, { params });

    const features:WindSpeedLayerFeature[] = res.data && res.data.features && res.data.features.length
        ? res.data.features
        : undefined;
    // console.log(features);

    return features;
}