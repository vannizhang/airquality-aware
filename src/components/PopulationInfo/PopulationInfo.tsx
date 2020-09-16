import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';

import DonutChart from './DonutChart';

const PopulationInfo = () => {

    const getDataForDonutChart = ()=>{
        return [
            {
                label: 'A',
                value: 20,
            },
            {
                label: 'B',
                value: 40,
            },
            {
                label: 'C',
                value: 35,
            },
        ]
    }

    return (
        <div>
            <SectionHeader 
                text='Popluation'
            />

            <div
                style={{
                    // margin: '3rem',
                    width: '160px',
                    height: '160px',
                    border: '1px solid rgba(200,200,200,.3)',
                }}
            >
                <DonutChart 
                    data={getDataForDonutChart()}
                />
            </div>
        </div>
    )
}

export default PopulationInfo
