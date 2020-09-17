const AppConfig = {
    // 'webmap-id': '5f3b7605b3364e7bb2416c93fae00995', 
    'webmap-id': '571b442ff06f47cd9991fe22197276d1',
    'ari-quality-service': {
        'current': 'https://services.arcgis.com/cJ9YHowT8TU7DUyn/arcgis/rest/services/AirNowLatestContoursCombined/FeatureServer/0',
        'today': 'https://services.arcgis.com/cJ9YHowT8TU7DUyn/ArcGIS/rest/services/AirNowAQIForecast/FeatureServer/0',
        'tomorrow': 'https://services.arcgis.com/cJ9YHowT8TU7DUyn/ArcGIS/rest/services/AirNowAQIForecast/FeatureServer/1'
    },
    'wind-speed-forecast-service': 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_WindSpeed_v1/FeatureServer/0',
    'enriched-population-service': 'https://services.arcgis.com/nGt4QxSblgDfeJn9/arcgis/rest/services/AirQuality_Enriched/FeatureServer/0',
    'race-info-service': 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Population_by_Race_and_Hispanic_Origin_Boundaries/FeatureServer/2',
    'at-risk-population-service': 'https://services.arcgis.com/jIL9msH9OI208GCb/ArcGIS/rest/services/Enriched_Enriched_United_States_Tract_Boundaries_2018/FeatureServer/0'
};

export const UIConfig = {
    'sidebar-width': 415,
    'sidebar-background': 'rgba(47,61,94,.85)',
    'sidebar-background-opaque': 'rgba(47,61,94,1)',
    'text-color': '#E2E2E2',
    'indicator-color': '#40C4ED', 
    'indicator-color-above-national-ave': '#d9a252',
    'above-national-ave': '#75C7E9',
    'below-national-ave': '#0878BD'
};

export default AppConfig;