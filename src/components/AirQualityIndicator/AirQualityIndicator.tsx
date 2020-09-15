
import React from 'react';

import { AirQualityForecast, AirQualityCategory } from 'air-quality-aware'

type Props = {
    data: AirQualityForecast
}

const ColorLookup:Record<AirQualityCategory, string> = {
    'Good': '#00d1ae',
    'Moderate': '#fdff80',
    'Unhealthy for Sensitive Groups': '#ff9700',
    'Unhealthy': '#ef495d',
    'Very Unhealthy': '#825ca7',
    'Hazardous': '#9b258f',
}

const AirQualityIndicator:React.FC<Props> = ({
    data
}:Props) => {

    const getIndicators = ()=>{

        const keys = Object.keys(data);

        return keys.map(key=>{

            const catgeory:AirQualityCategory = data[key];
            const color = ColorLookup[catgeory]

            return (
                <div 
                    key={key}
                    style={{
                        'width': '33%'
                    }}
                >
                    <div
                        className={'text-center'}
                        style={{
                            'display': 'flex',
                            'justifyContent': 'center',
                            'flexGrow': 1,
                        }}
                    >
                        <div 
                            style={{
                                'background': color,
                                'borderRadius': '50%',
                                'height': '90px',
                                'width': '90px',
                                'display': 'flex',
                                'justifyContent': 'center',
                                'alignItems': 'center'
                            }}
                        >
                            <span 
                                className='font-size--1'
                                style={{
                                    'textShadow': '0 0 3px #000'
                                }}
                            >{key}</span>
                        </div>
                    </div>

                    <div className='text-center leader-quarter'>
                        <span className='font-size--3'>{catgeory}</span>
                    </div>
                </div>

            );

        })

    }

    return data ? (
        <div>
            <div className='text-center trailer-half'>
                <span className='font-size-2 avenir-light'>Air Quality Index</span>
            </div>

            <div
                style={{
                    'display': 'flex',
                    'justifyContent': 'center'
                }}
            >
                { getIndicators() }
            </div>

        </div>

    ) : null;
}

export default AirQualityIndicator
