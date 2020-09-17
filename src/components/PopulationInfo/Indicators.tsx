import React from 'react'
import { UIConfig } from '../../AppConfig';
import { PopulationInfoItem } from 'air-quality-aware'

type Props = {
    data: PopulationInfoItem[];
}

const Indicators:React.FC<Props> = ({
    data
}) => {

    const getIndicators = ()=>{

        return data.map(d=>{
            return (
                <div key={d.label} className='text-center trailer-quarter'>
                    <span className='font-size-1'
                        style={{
                            'color': UIConfig["indicator-value-color"]
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
        <div className='leader-quarter'>
            { getIndicators() }
        </div>
    )
}

export default Indicators
