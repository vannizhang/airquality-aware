
import React from 'react';

import { AirQualityForecast, AirQualityCategory } from 'air-quality-aware'

type Props = {
    data: AirQualityForecast
}

const ColorLookup:Record<AirQualityCategory, string> = {
    'Good': 'rgb(0,228,0)',
    'Moderate': 'rgb(255,255,0)',
    'Unhealthy for Sensitive Groups': 'rgb(255,126,0)',
    'Unhealthy': 'rgb(255,0,0)',
    'Very Unhealthy': 'rgb(153,0,76)',
    'Hazardous': 'rgb(76,0,38)',
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
                                className='font-size--1 avenir-demi'
                                style={{
                                    'textShadow': '0 0 2px #333'
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
