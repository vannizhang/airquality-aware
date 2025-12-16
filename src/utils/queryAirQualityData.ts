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

// Field Name in the Air Quality Layer for Current Condition
const AirQualityCategoryFieldNameCurrent = 'gridcode';

// Field Name in the Air Quality Layer for Today and Tomorrow Forecast
const AirQualityCategoryFieldNameTodayAndTomorrow = 'MaxAQICat';

export const queryAirQualityData = async(queryLocation:QueryLocation):Promise<AirQualityForecast>=>{

    const { 
        current, 
        today, 
        tomorrow 
    } = AppConfig["ari-quality-service"];

    const { longitude, latitude } = queryLocation;

    const geometry = {
        x: longitude,
        y: latitude,
        spatialReference: {
            wkid: 4326
        }
    }

    if(longitude > bbox.xmax || longitude < bbox.xmin || latitude > bbox.ymax || latitude < bbox.ymin){
        throw new Error('No Data Available');
    }

    const queryParamsBase = {
        f: 'json',
        // outFields: AirQualityCategoryFieldNameCurrent,
        geometry: JSON.stringify(geometry),
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: 'false'
    };

    const queryParamsForCurrent = {
        ...queryParamsBase,
        outFields: AirQualityCategoryFieldNameCurrent
    };

    const queryParamsForTodayAndTomorrow = {
        ...queryParamsBase,
        outFields: AirQualityCategoryFieldNameTodayAndTomorrow
    };

    try {
        const resCurrent = await axios(`${current}/query`, { params: queryParamsForCurrent });
        // console.log(resCurrent)

        if(resCurrent?.data?.error){
            throw(resCurrent?.data?.error)
        }

        const feature4CurrentCondition:AirQualityLayerFeature = resCurrent.data && resCurrent.data.features && resCurrent.data.features[0] 
            ? resCurrent.data.features[0] 
            : undefined;
        
        const gridcode4CurrentCondition:number = feature4CurrentCondition && feature4CurrentCondition.attributes && feature4CurrentCondition.attributes[AirQualityCategoryFieldNameCurrent]
            ? feature4CurrentCondition.attributes[AirQualityCategoryFieldNameCurrent]
            : undefined;
        const category4CurrentCondition:AirQualityCategory = (
            gridcode4CurrentCondition !== undefined && 
            gridcode4CurrentCondition in Gridcode2AirQualityCategoryLookup
        )
            ? Gridcode2AirQualityCategoryLookup[gridcode4CurrentCondition] 
            : 'Good';

        const resToday = await axios(`${today}/query`, { params: queryParamsForTodayAndTomorrow });
        // console.log(resToday)

        if(resToday?.data?.error){
            throw(resToday?.data?.error)
        }

        const feature4TodayCondition:AirQualityLayerFeature = resToday.data && resToday.data.features && resToday.data.features[0] 
            ? resToday.data.features[0] 
            : undefined;
        
        const category4TodayCondition:AirQualityCategory = (
            feature4TodayCondition && 
            feature4TodayCondition.attributes[AirQualityCategoryFieldNameTodayAndTomorrow] && 
            feature4TodayCondition.attributes[AirQualityCategoryFieldNameTodayAndTomorrow].trim() !== ''
        )
            ? feature4TodayCondition.attributes[AirQualityCategoryFieldNameTodayAndTomorrow]
            : 'Good';
    
        const resTomorrow = await axios(`${tomorrow}/query`, { params: queryParamsForTodayAndTomorrow });
        // console.log(resTomorrow)

        if(resTomorrow?.data?.error){
            throw(resTomorrow?.data?.error)
        }
        const feature4TomorrowCondition:AirQualityLayerFeature = resTomorrow.data && resTomorrow.data.features && resTomorrow.data.features[0] 
            ? resTomorrow.data.features[0] 
            : undefined;
        const category4TomorrowCondition:AirQualityCategory = (
            feature4TomorrowCondition &&
            feature4TomorrowCondition.attributes[AirQualityCategoryFieldNameTodayAndTomorrow] &&
            feature4TomorrowCondition.attributes[AirQualityCategoryFieldNameTodayAndTomorrow].trim() !== ''
        )
            ? feature4TomorrowCondition.attributes[AirQualityCategoryFieldNameTodayAndTomorrow]
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