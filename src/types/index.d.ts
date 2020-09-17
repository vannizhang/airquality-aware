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

    type RaceInfoFeature = {
        attributes: {
            // Total Population
            B03002_001E: number
            // White
            B03002_calc_pctNHWhiteE: number; 
            // Black
            B03002_calc_pctBlackE: number; 
            // Native American
            B03002_calc_pctAIANE: number; 
            // Asian
            B03002_calc_pctAsianE: number; 
            // Pacific Islander
            B03002_calc_pctNHOPIE: number; 
            // Other Race
            B03002_calc_pctOtherE: number; 
            // Two or More Races
            B03002_calc_pct2OrMoreE: number; 
            // Hispanic 
            B03002_calc_pctHispLatE: number; 
        }
    };

    type AtRiskPopulationFeature = {
        attributes: { 
            TOTPOP_CY: number;
            AtRiskOccupations: number; 
            PctOccAtRisk: number;  
            PctSeniors: number;  
            PctChildrenAtRisk: number; 
            FlagOcc: number;  
            FlagSeniors: number;  
            FlagChildren: number;
            // flag for asthma, above 100 indicates above national ave
            MP14088a_B: number;
            // percent astham
            MP14088a_I: number;  
        }
    }

    type PopulationInfoItem = {
        label: string;
        value: number;
        aboveNationalAverage?: boolean;
    }

    type AtRisOccupationsInfo = {
        total: number;
        percent: number;
        aboveNationalAverage: boolean;
    }

    type PopulationData = {
        raceInfo: {
            label: string;
            value: number;
            color?: string;
        }[];
        sensitivePopulationInfo: PopulationInfoItem[];
        // occupationInfo: PopulationInfoItem[],
        atRiskOccupationsInfo: AtRisOccupationsInfo;
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
        PopulationData,
        RaceInfoFeature,
        AtRiskPopulationFeature,
        AtRisOccupationsInfo
    }
}