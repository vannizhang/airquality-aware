import { QueryLocation } from 'air-quality-aware';
import axios from 'axios';

type Address = {
    City: string;
    CountryCode: string;
    Region: string;
    Subregion: string;
    LongLabel: string;
    Match_addr: string;
    PlaceName: string;
    Postal: string;
}

export type ReverseGeocodingResult = {
    address?: Address;
    error: {
        code: number;
        message: string;
    };
}

export const reverseGeocode = async(location:QueryLocation):Promise<ReverseGeocodingResult>=>{

    const requestUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode';

    const {
        longitude,
        latitude,
        // spatialReference
    } = location

    const params = {
        location: JSON.stringify({
            x: longitude,
            y: latitude,
            spatialReference: {
                wkid: 4326
            }
        }),
        f: 'json'
    };

    const { data } = await axios.get(requestUrl, { params});

    return data;
}