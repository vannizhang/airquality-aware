
import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';

import DonutChart, { DonutChartDataItem } from './DonutChart';
import { PopulationData, PopulationInfoItem } from 'air-quality-aware';

type Props = {
    data: PopulationData
}

const PopulationInfo:React.FC<Props> = ({
    data
}:Props) => {

    return data ? (
        <div>
            <SectionHeader 
                text='Popluation'
            />

            <div
                style={{
                    // margin: '3rem',
                    width: '140px',
                    height: '140px',
                    // border: '1px solid rgba(200,200,200,.3)',
                }}
            >
                <DonutChart 
                    data={data.raceInfo}
                />
            </div>
        </div>
    ) : null
}

export default PopulationInfo
