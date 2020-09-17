
import { urlFns } from 'helper-toolkit-ts';

type HashParams = {
    [key: string]: string;
};

type UrlHashParamKey = '@';

export type MapCenterLocation = {
    lon: number;
    lat: number;
    zoom: number;
}

// const DefaultHashParams: HashParams = urlFns.parseHash();

export const saveMapLocationInUrlHashParams = (mapCenterLocation: MapCenterLocation) => {
    const key: UrlHashParamKey = '@';

    if (!mapCenterLocation) {
        return;
    }

    const { lon, lat, zoom } = mapCenterLocation;

    urlFns.updateHashParam({
        key,
        value: `${lon},${lat},${zoom}`,
    });
};

export const getMapLocationFromUrlHashParams = (hashParams?: HashParams):MapCenterLocation => {
    hashParams = hashParams || urlFns.parseHash();

    const key: UrlHashParamKey = '@';

    if (!hashParams[key]) {
        return null;
    }

    const values: number[] = hashParams[key].split(',').map((d: string) => +d);

    const [lon, lat, zoom] = values;

    return { lon, lat, zoom };
};