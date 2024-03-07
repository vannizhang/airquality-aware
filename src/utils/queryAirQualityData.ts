import axios from 'axios';
import AppConfig from '../AppConfig';

import {
    QueryLocation,
    AirQualityCategory,
    AirQualityForecast,
    AirQualityLayerFeature
} from 'air-quality-aware';

const Gridcode2AirQualityCategoryLookup: {
    [key:number]: AirQualityCategory
} = {
    1: 'Good',
    2: 'Moderate',
    3: 'Unhealthy for Sensitive Groups',
    4: 'Unhealthy',
    5: 'Very Unhealthy',
    6: 'Hazardous'
};

/**
 * A hardcoded bbox for the air quality forecast service.
 * Any query location outside of this bbox should get an error of "No Data"
 */
const bbox = {
    xmin: -170,
    xmax: -50,
    ymin: 16,
    ymax: 70
}

export const queryAirQualityData = async(queryLocation:QueryLocation):Promise<AirQualityForecast>=>{

    const { 
        current, 
        today, 
        tomorrow 
    } = AppConfig["ari-quality-service"];

    const { longitude, latitude } = queryLocation;

    if(longitude > bbox.xmax || longitude < bbox.xmin || latitude > bbox.ymax || latitude < bbox.ymin){
        throw new Error('No Data Available');
    }

    const params = {
        f: 'json',
        outFields: 'gridcode',
        geometry: JSON.stringify(queryLocation),
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: 'false'
    };

    try {
        const resCurrent = await axios(`${current}/query`, { params });
        // console.log(resCurrent)

        if(resCurrent?.data?.error){
            throw(resCurrent?.data?.error)
        }

        const feature4CurrentCondition:AirQualityLayerFeature = resCurrent.data && resCurrent.data.features && resCurrent.data.features[0] 
            ? resCurrent.data.features[0] 
            : undefined;
        const category4CurrentCondition:AirQualityCategory = feature4CurrentCondition 
            ? Gridcode2AirQualityCategoryLookup[feature4CurrentCondition.attributes.gridcode] 
            : 'Good';
    
        const resToday = await axios(`${today}/query`, { params });
        // console.log(resToday)

        if(resToday?.data?.error){
            throw(resToday?.data?.error)
        }

        const feature4TodayCondition:AirQualityLayerFeature = resToday.data && resToday.data.features && resToday.data.features[0] 
            ? resToday.data.features[0] 
            : undefined;
        const category4TodayCondition:AirQualityCategory = feature4TodayCondition 
            ? Gridcode2AirQualityCategoryLookup[feature4TodayCondition.attributes.gridcode] 
            : 'Good';
    
        const resTomorrow = await axios(`${tomorrow}/query`, { params });
        // console.log(resTomorrow)

        if(resTomorrow?.data?.error){
            throw(resTomorrow?.data?.error)
        }
        const feature4TomorrowCondition:AirQualityLayerFeature = resTomorrow.data && resTomorrow.data.features && resTomorrow.data.features[0] 
            ? resTomorrow.data.features[0] 
            : undefined;
        const category4TomorrowCondition:AirQualityCategory = feature4TomorrowCondition 
            ? Gridcode2AirQualityCategoryLookup[feature4TomorrowCondition.attributes.gridcode] 
            : 'Good';

        return {
            current: category4CurrentCondition,
            today: category4TodayCondition,
            tomorrow: category4TomorrowCondition
        }

    } catch(err){
        console.error(err);
        return null;
    }

};