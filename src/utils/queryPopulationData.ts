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

        if(!feature){
            return undefined;
        }

        const raceInfo: DonutChartDataItem[] = [
            {
                label: 'Asian',
                value: feature.attributes.RacePercent_AsianPacIslander >= 0 ? feature.attributes.RacePercent_AsianPacIslander : 0,
                color: '#1253D6'
            },
            {
                label: 'Black',
                value: feature.attributes.RacePercent_B03002_calc_pctBlac >= 0 ? feature.attributes.RacePercent_B03002_calc_pctBlac : 0,
                color: '#1D6FDC'
            },
            {
                label: 'Hispanic',
                value: feature.attributes.RacePercent_B03002_calc_pctHisp >= 0 ? feature.attributes.RacePercent_B03002_calc_pctHisp : 0,
                color: '#298BE2'
            },
            {
                label: 'Other',
                value: feature.attributes.RacePercent_OtherRace >= 0 ? feature.attributes.RacePercent_OtherRace : 0,
                color: '#35A8E7'
            },
            {
                label: 'White',
                value: feature.attributes.RacePercent_B03002_calc_pctNHWh >= 0 ? feature.attributes.RacePercent_B03002_calc_pctNHWh : 0,
                color: '#40C4ED'
            }
        ];

        const sensitivePopulationInfo: PopulationInfoItem[] = [
            {
                label: 'Seniors',
                value: feature.attributes.Enrich4_Stripped_agedependency_ >= 0 ? feature.attributes.Enrich4_Stripped_agedependency_ : 0,
            },
            {
                label: 'School Age',
                value: feature.attributes.Enrich4_Stripped_SchoolAgePerce >= 0 ? feature.attributes.Enrich4_Stripped_SchoolAgePerce : 0,
            },
            {
                label: 'Asthmatic',
                value: feature.attributes.Enrich4_Stripped_healthpersonal >= 0 ? feature.attributes.Enrich4_Stripped_healthpersonal : 0,
            },
        ];

        const occupationInfo: PopulationInfoItem[] = [
            {
                label: 'Occupation: Construction',
                value: feature.attributes.Enrich4_Stripped_occupation_occ >= 0 ? feature.attributes.Enrich4_Stripped_occupation_occ : 0,
                aboveNationalAverage: feature.attributes.Enrich4_Stripped_ConstructionFl === 1
            },
            {
                label: 'Occupation: Farm',
                value: feature.attributes.Enrich4_Stripped_occupation_o_1 >= 0 ? feature.attributes.Enrich4_Stripped_occupation_o_1 : 0,
                aboveNationalAverage: feature.attributes.Enrich4_Stripped_FarmerFlag === 1
            },
            {
                label: 'Occupation: Protective Service',
                value: feature.attributes.Enrich4_Stripped_occupation_o_2 >= 0 ? feature.attributes.Enrich4_Stripped_occupation_o_2 : 0,
                aboveNationalAverage: feature.attributes.Enrich4_Stripped_ProtectiveFlag === 1 
            },
        ];

        const totalPopulation = feature.attributes.RacePercent_B03002_001E;

        return {
            raceInfo,
            sensitivePopulationInfo,
            occupationInfo,
            totalPopulation
        };

    } catch(err){
        console.error(err);
    }

};