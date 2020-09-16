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
            AirCleanerFlag: number; 
            AsianPacificIslanderPercent: number; 
            AsthmaFlag: number; 
            COUNTY: string; 
            ConstructionFlag: number; 
            FIPS: string; 
            FarmerFlag: number; 
            OtherRacePercent: number; 
            STATE: string; 
            SchoolAgePercent: number; 
            agedependency_senior_cy_p: number; 
            healthpersonalcare_mp14088a_b_p: number; 
            occupation_occcons_cy_p: number; 
            occupation_occfarm_cy_p: number; 
            occupation_occprot_cy_p: number; 
            populationtotals_totpop_cy: number; 
            raceandhispanicorigin_hisppop_c: number; 
            raceandhispanicorigin_nhspblk_c: number; 
            raceandhispanicorigin_nhspwht_c: number; 
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
        }[]
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