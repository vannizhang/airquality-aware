import React from 'react'
import { PopulationInfoItem } from 'air-quality-aware'
import { UIConfig } from '../../AppConfig'

type Props = {
    data: PopulationInfoItem[];
}

const LegendData = [
    {
        label: 'Above National Average',
        color: UIConfig["above-national-ave"]
    },
    {
        label: 'Below National Average',
        color: UIConfig["below-national-ave"]
    }
]

const PercentageBars:React.FC<Props> = ({
    data
}) => {

    const getLegends = ()=>{
        const legends = LegendData.map(d=>{

            return (
                <div
                    key={d.label}
                    style={{
                        'display': 'flex',
                        'flexGrow': 1,
                        'alignItems': 'center',
                        // 'marginRight': '.25rem'
                    }}
                >
                    <div
                        style={{
                            'width': '18px',
                            'height': '15px',
                            'backgroundColor': d.color,
                            'marginRight': '5px',
                            
                        }}
                    ></div>

                    <div
                        style={{
                            'marginRight': '.5rem',
                            'flexGrow': 1
                        }}
                    >
                        <span className='font-size--3'>{d.label}</span>
                    </div>
                </div>

            )
        });

        return (
            <div 
                className='leader-half'
                style={{
                    'display': 'flex',
                    // justifyContent: 'space-between'
                }}
            >
                { legends }
            </div>
        )
    }

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
                            'background': '#303B4C'
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
        <div className='leader-1'>
            { getPctBars() }
            { getLegends() }
        </div>
    )
}

export default PercentageBars
