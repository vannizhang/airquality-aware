
import React from 'react';

import { PopulationData, PopulationInfoItem } from 'air-quality-aware';

import DonutChart, { 
    DonutChartDataItem 
} from './DonutChart';
import Indicators from './Indicators';
import PctBars from './PercentageBars';
import SectionHeader from '../SectionHeader/SectionHeader';

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
                    'display': 'flex',
                    'justifyContent': 'center'
                }}
            >
                <div
                    style={{
                        marginRight: '3rem'
                    }}
                >
                    <Indicators 
                        data={data.sensitivePopulationInfo}
                    />
                </div>

                <div
                    style={{
                        // margin: '3rem',
                        width: '180px',
                        height: '180px',
                        // border: '1px solid rgba(200,200,200,.3)',
                    }}
                >
                    <DonutChart 
                        data={data.raceInfo}
                    />
                </div>

            </div>

            <div
                className='leader-half'
            >
                <PctBars 
                    data={data.occupationInfo}
                />
            </div>
            

        </div>
    ) : null
}

export default PopulationInfo
