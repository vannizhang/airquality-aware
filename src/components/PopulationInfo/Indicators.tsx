import { PopulationInfoItem } from 'air-quality-aware'
import React from 'react'
import { UIConfig } from '../../AppConfig';

type Props = {
    data: PopulationInfoItem[];
}

const Indicators:React.FC<Props> = ({
    data
}) => {

    const getIndicators = ()=>{

        return data.map(d=>{
            return (
                <div key={d.label} className='text-center trailer-half'>
                    <span className='font-size-2'
                        style={{
                            'color': UIConfig["indicator-label-color"]
                        }}
                    >{d.value}%</span>
                    <br/>
                    <span className='font-size--1'
                        style={{
                            'color': UIConfig["indicator-label-color"]
                        }}
                    >{d.label}</span>
                </div>
            )
        })
    };

    return (
        <div>
            { getIndicators() }
        </div>
    )
}

export default Indicators
