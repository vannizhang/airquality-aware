
import React from 'react';

import { PopulationData, PopulationInfoItem } from 'air-quality-aware';

import DonutChart, { 
    DonutChartDataItem 
} from './DonutChart';
import Indicators from './Indicators';
import WorkersAtRisk from './WorkersAtRisk';
import SectionHeader from '../SectionHeader/SectionHeader';
import { UIConfig } from '../../AppConfig';

type Props = {
    data: PopulationData
}

const PopulationInfo:React.FC<Props> = ({
    data
}:Props) => {

    return data && data.raceInfo && data.sensitivePopulationInfo ? (
        <div>
            <SectionHeader 
                text='Population'
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
                        totalPopulation={data.totalPopulation}
                    />
                </div>

            </div>

            <WorkersAtRisk 
                data={data.atRiskOccupationsInfo}
            />

            <div
                className='leader-1 text-center font-size--2'
            >
                <span className='margin-right-2'
                    style={{
                        color: UIConfig["indicator-color-above-national-ave"]
                    }}
                >above U.S. average</span>

                <span
                    style={{
                        color: UIConfig["indicator-color"]
                    }}
                >below U.S. average</span>
            </div>
            
        </div>
    ) : null
}

export default PopulationInfo
