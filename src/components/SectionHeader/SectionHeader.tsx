import React from 'react'

type Props = {
    text: string;
}

const SectionHeader:React.FC<Props> = ({
    text
}) => {
    return (
        <div className='text-center trailer-half'>
            <span className='font-size-2 avenir-light'>{ text }</span>
        </div>
    )
}

export default SectionHeader
