declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare module 'air-quality-aware' {

    type AirQualityCategory = 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';

    type QueryLocation = {
        spatialReference: {
            latestWkid: number, 
            wkid: number
        },
        x: number;
        y: number;
    };

    
    type AirQualityLayerFeature = {
        attributes: {
            gridcode: number;
        }
    };

    type AirQualityForecast = {
        current: AirQualityCategory;
        today: AirQualityCategory;
        tomorrow: AirQualityCategory;
    }

    type WindSpeedLayerFeature = {
        attributes: {
            fromdate: number;
            todate: number;
            force: number;
            label: string
        }
    };

    type PopulationInfoFeature = {
        attributes: {
            Enrich4_Stripped_AsthmaFlag: number; 
            Enrich4_Stripped_ConstructionFl: number; 
            Enrich4_Stripped_FarmerFlag: number; 
            Enrich4_Stripped_ProtectiveFlag: number; 
            Enrich4_Stripped_SchoolAgePerce: number; 
            Enrich4_Stripped_agedependency_: number; 
            Enrich4_Stripped_healthpersonal: number; 
            // 2020 Occupation: Farm/Fish/Forestry: Percent
            Enrich4_Stripped_occupation_o_1: number; 
            // 2020 Occupation: Construction/Extraction: Percent
            Enrich4_Stripped_occupation_occ: number; 
            // 2020 Occupation: Protective Service: Percent
            Enrich4_Stripped_occupation_o_2: number; 
            RacePercent_B03002_001E: number;
            RacePercent_AsianPacIslander: number; 
            RacePercent_B03002_calc_pctHisp: number; 
            RacePercent_B03002_calc_pctBlac: number; 
            RacePercent_B03002_calc_pctNHWh: number; 
            RacePercent_OtherRace: number; 
        }
    }

    type PopulationInfoItem = {
        label: string;
        value: number;
        aboveNationalAverage?: boolean;
    }

    type PopulationData = {
        raceInfo: {
            label: string;
            value: number;
            color?: string;
        }[],
        sensitivePopulationInfo: PopulationInfoItem[],
        occupationInfo: PopulationInfoItem[],
        totalPopulation: number;
    }

    export {
        QueryLocation,
        AirQualityCategory,
        AirQualityForecast,
        AirQualityLayerFeature,
        WindSpeedLayerFeature,
        PopulationInfoFeature,
        PopulationInfoItem,
        PopulationData
    }
}