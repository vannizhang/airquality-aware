import { AtRisOccupationsInfo } from 'air-quality-aware';
import React from 'react'
import SectionHeader from '../SectionHeader/SectionHeader';
import Indicator from './Indicator';

type Props = {
    data: AtRisOccupationsInfo
}

const WorkersAtRisk:React.FC<Props> = ({
    data
}) => {
    return (
        <div>
            <SectionHeader 
                text='Workers at Risk'
            />

            <div 
                style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <div style={{
                    'padding': '0 1rem'
                }}>
                    <Indicator 
                        label='workers'
                        value={data.total.toString()}
                    />
                </div>

                <div style={{
                    'padding': '0 1rem'
                }}>
                    <Indicator 
                        label='workforce'
                        value={`${data.percent}%`}
                    />
                </div>

            </div>
        </div>
    )
}

export default WorkersAtRisk
