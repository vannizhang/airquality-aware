import React from 'react'
import { UIConfig } from '../../AppConfig';

type Props = {
    label: string;
    value: string;
    aboveAverage?: boolean;
}

const Indicator:React.FC<Props> = ({
    label,
    value,
    aboveAverage
}) => {
    return (
        <div className='text-center trailer-quarter'>
            <span className='font-size-1'
                style={{
                    'color': aboveAverage ? UIConfig["indicator-color-above-national-ave"] : UIConfig["indicator-color"]
                }}
            >{value}</span>
            <br/>
            <span className='font-size--1'
                style={{
                    'color': UIConfig["text-color"]
                }}
            >{label}</span>
        </div>
    )
}

export default Indicator
