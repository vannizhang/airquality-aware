import axios from 'axios';

import {
    QueryLocation,
    PopulationInfoFeature,
    PopulationInfoItem,
    PopulationData
} from 'air-quality-aware';

import{ DonutChartDataItem } from '../components/PopulationInfo/DonutChart';

import AppConfig from '../AppConfig';

export const queryPopulationData = async(queryLocation:QueryLocation): Promise<PopulationData>=>{

    const serviceUrl = AppConfig["enriched-population-service"];

    const params = {
        f: 'json',
        outFields: '*',
        geometry: JSON.stringify(queryLocation),
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: 'false'
    };

    try {
        const res = await axios(`${serviceUrl}/query`, { params });
        // console.log(res);

        const feature:PopulationInfoFeature = res?.data?.features?.[0]
        console.log(feature);

        const raceInfo: DonutChartDataItem[] = [
            {
                label: 'Asian',
                value: feature.attributes.AsianPacificIslanderPercent >= 0 ? feature.attributes.AsianPacificIslanderPercent : 0,
                color: '#FAB58D'
            },
            {
                label: 'Black',
                value: feature.attributes.raceandhispanicorigin_nhspblk_c >= 0 ? feature.attributes.raceandhispanicorigin_nhspblk_c : 0,
                color: '#F89C6C'
            },
            {
                label: 'Hispanic',
                value: feature.attributes.raceandhispanicorigin_hisppop_c >= 0 ? feature.attributes.raceandhispanicorigin_hisppop_c : 0,
                color: '#F5854C'
            },
            {
                label: 'Other',
                value: feature.attributes.OtherRacePercent >= 0 ? feature.attributes.AsianPacificIslanderPercent : 0,
                color: '#F26930'
            },
            {
                label: 'White',
                value: feature.attributes.raceandhispanicorigin_nhspwht_c >= 0 ? feature.attributes.raceandhispanicorigin_nhspwht_c : 0,
                color: '#E64F25'
            }
        ];

        return {
            raceInfo
        };

    } catch(err){
        console.error(err);
    }

};