import React from 'react'
import { UIConfig } from '../../AppConfig';
import { PopulationInfoItem } from 'air-quality-aware';
import Indicator from './Indicator';

type Props = {
    data: PopulationInfoItem[];
}

const Indicators:React.FC<Props> = ({
    data
}) => {

    const getIndicators = ()=>{

        return data.map(d=>{
            return (
                <Indicator 
                    key={d.label}
                    label={d.label}
                    value={d.value + '%'}
                    aboveAverage={d.aboveNationalAverage}
                />
            )
        })
    };

    return (
        <div className='leader-quarter'>
            { getIndicators() }
        </div>
    )
}

export default Indicators
