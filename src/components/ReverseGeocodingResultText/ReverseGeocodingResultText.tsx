import React from 'react'
import { ReverseGeocodingResult } from '../../utils/reverseGeocoding'

type Props = {
    data: ReverseGeocodingResult
};

const ReverseGeocodingResultText:React.FC<Props> = ({
    data
}) => {

    const getLocationName = ()=>{
        if(!data || !data.address){
            return null;
        }

        const { City, Region, Subregion, Postal } = data.address;

        return (
            <span className='font-size--1 avenir-light'>Information for selected neighorhood in {City || Postal || Subregion || 'Unknown place'}, {Region}</span>
        );
    }

    return data && data.address ? (
        <div>
            {getLocationName()}
        </div>
    ) : null;
}

export default ReverseGeocodingResultText
