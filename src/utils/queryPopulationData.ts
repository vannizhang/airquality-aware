import axios from 'axios';

import {
    QueryLocation,
    PopulationInfoFeature,
    PopulationInfoItem,
    PopulationData, 
    RaceInfoFeature, 
    AtRiskPopulationFeature,
    AtRisOccupationsInfo
} from 'air-quality-aware';

import{ DonutChartDataItem } from '../components/PopulationInfo/DonutChart';

import AppConfig from '../AppConfig';

const queryRaceInfo = async(queryLocation:QueryLocation): Promise<{
    raceInfo: DonutChartDataItem[],
    totalPopulation: number
}>=>{

    const raceInfoServiceURL = AppConfig["race-info-service"];

    const params = {
        f: 'json',
        outFields: '*',
        geometry: JSON.stringify(queryLocation),
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: 'false'
    };

    try {

        const raceInfoRes = await axios(`${raceInfoServiceURL}/query`, { 
            params
        });
        const raceInfofeature:RaceInfoFeature = raceInfoRes?.data?.features?.[0];

        if(!raceInfofeature){
            return {
                raceInfo: undefined,
                totalPopulation: undefined
            };
        }
    
        const totalPopulation = raceInfofeature.attributes.B03002_001E;
    
        const raceInfo: DonutChartDataItem[] = raceInfofeature ? [
            {
                label: 'White',
                value: raceInfofeature.attributes.B03002_calc_pctNHWhiteE,
                color: '#999284'
            },
            {
                label: 'Black',
                value: raceInfofeature.attributes.B03002_calc_pctBlackE,
                color: '#ff5959'
            },
            {
                label: 'Native American',
                value: raceInfofeature.attributes.B03002_calc_pctAIANE,
                color: '#00a1e6'
            },
            {
                label: 'Asian',
                value: raceInfofeature.attributes.B03002_calc_pctAsianE,
                color: '#ab579d'
            },
            {
                label: 'Pacific Islander',
                value: raceInfofeature.attributes.B03002_calc_pctNHOPIE,
                color: '#00c0c7'
            },
            {
                label: 'Other',
                value: raceInfofeature.attributes.B03002_calc_pctOtherE,
                color: '#cdcdb9'
            },
            {
                label: 'Two or More Races',
                value: raceInfofeature.attributes.B03002_calc_pct2OrMoreE,
                color: '#d1c10d'
            },
            {
                label: 'Hispanic',
                value: raceInfofeature.attributes.B03002_calc_pctHispLatE,
                color: '#69bf71'
            }
        ] : undefined;
    
        return {
            raceInfo,
            totalPopulation
        }

    } catch(err){
        console.error(err);

        return {
            raceInfo: undefined,
            totalPopulation: undefined
        };
    }

}

const queryAtRiskPopulation = async(queryLocation:QueryLocation): Promise<{
    sensitivePopulationInfo: PopulationInfoItem[]
    atRiskOccupationsInfo: AtRisOccupationsInfo
}>=>{

    const atRsikPopuServiceURL = AppConfig["at-risk-population-service"];

    const params = {
        f: 'json',
        outFields: '*',
        geometry: JSON.stringify(queryLocation),
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: 'false'
    };

    try {
        const res = await axios(`${atRsikPopuServiceURL}/query`, { params });
        const feature:AtRiskPopulationFeature = res?.data?.features?.[0]

        if(!feature){
            return {
                sensitivePopulationInfo: undefined,
                atRiskOccupationsInfo: undefined
            };
        }

        const sensitivePopulationInfo: PopulationInfoItem[] = [
            {
                label: 'Seniors',
                value: +feature.attributes.PctSeniors.toFixed(1),
                aboveNationalAverage: feature.attributes.FlagSeniors === 1
            },
            {
                label: 'School Age',
                value: +feature.attributes.PctChildrenAtRisk.toFixed(1),
                aboveNationalAverage: feature.attributes.FlagChildren === 1
            },
            {
                label: 'Asthmatic',
                value: +((feature.attributes.MP14088a_B / feature.attributes.TOTPOP_CY) * 100).toFixed(1),
                aboveNationalAverage: feature.attributes.MP14088a_I > 100
            },
        ];

        const atRiskOccupationsInfo:AtRisOccupationsInfo = {
            total: feature.attributes.AtRiskOccupations,
            percent: +feature.attributes.PctOccAtRisk.toFixed(1),
            aboveNationalAverage: feature.attributes.FlagOcc === 1
        }

        return {
            sensitivePopulationInfo,
            atRiskOccupationsInfo
        };

    } catch(err){
        console.error(err);

        return {
            sensitivePopulationInfo: undefined,
            atRiskOccupationsInfo: undefined
        };
    }
}

export const queryPopulationData = async(queryLocation:QueryLocation): Promise<PopulationData>=>{

    try {

        const { 
            raceInfo, 
            totalPopulation 
        } = await queryRaceInfo(queryLocation);

        const { 
            sensitivePopulationInfo, 
            atRiskOccupationsInfo 
        } = await queryAtRiskPopulation(queryLocation);

        return {
            raceInfo,
            sensitivePopulationInfo,
            atRiskOccupationsInfo,
            totalPopulation
        };

    } catch(err){
        console.error(err);
        return undefined;
    }

};