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

    export {
        QueryLocation,
        AirQualityCategory,
        AirQualityForecast,
        AirQualityLayerFeature,
    }
}