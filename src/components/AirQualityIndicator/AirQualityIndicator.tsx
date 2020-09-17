
import React from 'react';

import { AirQualityForecast, AirQualityCategory } from 'air-quality-aware';
import SectionHeader from '../SectionHeader/SectionHeader';
import {
    stringFns
} from 'helper-toolkit-ts';

type Props = {
    data: AirQualityForecast
}

const ColorLookup:Record<AirQualityCategory, string> = {
    'Good': '#0ca98c',
    'Moderate': 'rgb(171,169,56)',
    'Unhealthy for Sensitive Groups': '#d3982d',
    'Unhealthy': '#bd565d',
    'Very Unhealthy': '#7d5a9f',
    'Hazardous': '#942789',
}

const DescriptionLookup: {
    category: AirQualityCategory
    amount: string;
    description: string;
}[] = [
    {
        category: 'Good',
        amount: '0 - 50',
        description: 'Air pollution poses little or no risk.'
    },
    {
        category: 'Moderate',
        amount: '51 - 100',
        description: 'may be a risk for people who are unusually sensitive to air pollution.'
    },
    {
        category: 'Unhealthy for Sensitive Groups',
        amount: '101 - 150',
        description: 'The general public is less likely to be affected'
    },
    {
        category: 'Unhealthy',
        amount: '151 - 200',
        description: 'Some members of the general public may experience health effects'
    },
    {
        category: 'Very Unhealthy',
        amount: '201 - 300',
        description: 'The risk of health effects is increased for everyone.'
    },
    {
        category: 'Hazardous',
        amount: '301+',
        description: 'Emergency conditions: everyone is more likely to be affected'
    }
]


const AirQualityIndicator:React.FC<Props> = ({
    data
}:Props) => {

    const getIndicators = ()=>{

        const keys = Object.keys(data);

        return keys.map(key=>{

            const categeory:AirQualityCategory = data[key];
            const color = ColorLookup[categeory];
            const forecastTime = key === 'current' 
                ? 'Current' 
                : stringFns.capitalizeFirstLetter(key) + `'s forecast`

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
                                'height': '100px',
                                'width': '100px',
                                'display': 'flex',
                                'justifyContent': 'center',
                                'alignItems': 'center'
                            }}
                        >
                            <span 
                                className='font-size--1'
                                style={{
                                    'textShadow': '0 0 4px #000',
                                    'color': '#fff'
                                }}
                            >{forecastTime}</span>
                        </div>
                    </div>

                    <div className='text-center leader-half' style={{
                        'lineHeight': '1.25rem',
                        'fontSize': '14px'
                    }}>
                        <span>{categeory}</span>
                    </div>
                </div>

            );

        })

    }

    const getTableForDescriptions = ()=>{

        // active AirQualityCategory that's are dispalyed
        const activeCategories: AirQualityCategory[]  = []

        const keys = Object.keys(data);

        keys.forEach(key=>{
            const catgeory:AirQualityCategory = data[key];

            if(activeCategories.indexOf(catgeory) === -1){
                activeCategories.push(catgeory);
            }

        });

        const rows = DescriptionLookup
            .filter(d=>{
                return activeCategories.indexOf(d.category) > -1
            })
            .map(d=>{
                const { category, amount, description } = d;

                return (
                    <tr 
                        key={category}
                        className='font-size--3'
                        style={{
                            'background': ColorLookup[category],
                            'textShadow': '0 0 4px #000',
                            'color': '#fff'
                        }}
                    >
                        <td>
                            <span>{category}</span>
                            <br/>
                            <span>{amount}</span>
                        </td>
                        <td>
                            {description}
                        </td>
                    </tr>
                )
            });
        
        return(
            <table className='table table-plain'>
                <tbody>
                    { rows }
                </tbody>
            </table>
        );

    };

    return data ? (
        <div className="trailer-half">
            <SectionHeader 
                text='Air Quality Index'
            />

            <div
                style={{
                    'display': 'flex',
                    'justifyContent': 'center',
                    'marginBottom': '.75rem'
                }}
            >
                { getIndicators() }
            </div>

            {
                getTableForDescriptions()
            }
        </div>

    ) : null;
}

export default AirQualityIndicator
