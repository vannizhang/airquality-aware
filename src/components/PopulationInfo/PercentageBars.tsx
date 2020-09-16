import React from 'react'
import { PopulationInfoItem } from 'air-quality-aware'
import { UIConfig } from '../../AppConfig'

type Props = {
    data: PopulationInfoItem[];
}

const PercentageBars:React.FC<Props> = ({
    data
}) => {

    const getPctBars = ()=>{
        return data.map(d=>{
            const { label, value, aboveNationalAverage } = d;

            return (
                <div 
                    key={label}
                    className='trailer-half'
                >
                    <div>
                        <span className='font-size--2 avenir-light'>{label}</span>
                        <span className='font-size--2 avenir-light right'>{value.toFixed(1)}%</span>
                    </div>
                    <div 
                        style={{
                            'position': 'relative',
                            'width': '100%',
                            'height': '25px',
                            'background': '#CECCCC'
                        }}
                    >
                        <div
                            style={{
                                'position': 'absolute',
                                'top': 0,
                                'left': 0,
                                'width': `${value}%`,
                                'height': '100%',
                                'background': aboveNationalAverage ? UIConfig["above-national-ave"] : UIConfig["below-national-ave"]
                            }}
                        ></div>
                    </div>
                </div>
            )
        });
    }

    return (
        <div>
            { getPctBars() }
        </div>
    )
}

export default PercentageBars
