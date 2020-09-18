import React, {
    useContext,
    useState
} from 'react';

import { AppContext } from '../../contexts/AppContextProvider';
import { UIConfig } from '../../AppConfig';

type Props = {
    isExpanded: boolean;
    isLoading: boolean;
    isContentVisible: boolean;
    toggleBtnOnclick: (val:boolean)=>void;
    infoBtnOnClick: ()=>void;
}

const Sidebar:React.FC<Props> = ({
    isExpanded,
    isLoading,
    isContentVisible,
    toggleBtnOnclick,
    infoBtnOnClick,
    children
}) => {

    const { isMobile } = useContext(AppContext);

    const getToggleBtn = ()=>{
        if(!isMobile){
            return null;
        }

        return (
            <div className='text-center padding-leader-quarter padding-trailer-quarter' onClick={toggleBtnOnclick.bind(this, !isContentVisible)}>
                { isContentVisible ? <span className='icon-ui-down'></span> : <span className='icon-ui-up'></span>}
            </div>
        )
    }

    return (
        <div
            style={{
                'position': 'absolute',
                'right': 0,
                'top': !isMobile ? 0: 'unset',
                'bottom': isExpanded || isMobile ? 0 : 'unset',
                'maxHeight': '100%',
                'left': isMobile ? 0 : 'unset',
                'overflowY': 'auto',
                'overflowX': 'hidden',
                'width': isMobile ? 'unset' : UIConfig["sidebar-width"],
                'boxSizing': 'border-box',
                'background': UIConfig["sidebar-background"],
                'color': UIConfig["text-color"],
                'zIndex': 5
            }}
        >
            { getToggleBtn() }

            <div
                style={{
                    display: isContentVisible ? 'block' : 'none'
                }}
            >
                <div
                    style={{
                        backgroundColor: UIConfig["sidebar-background-opaque"],
                        padding: '.5rem 1rem'
                    }}
                >
                    <div className="trailer-0">
                        <span className="font-size-2">Air Quality Aware - Esri</span>
                        <span className="right icon-ui-question cursor-pointer" onClick={infoBtnOnClick}></span>
                    </div>

                    <div className='font-size--3 trailer-0'>
                        <span>data: <a className='link-light-blue' href='https://www.airnow.gov/' target='_blank'>EPA AirNow</a>, <a className='link-light-blue' href='https://www.noaa.gov/' target='_blank'>NOAA</a>, <a className='link-light-blue' href='https://www.census.gov/' target='_blank'>Census</a></span>
                    </div>
                </div>

                <div 
                    className="trailer-quarter"
                    style={{
                        padding: '.5rem 1rem 1rem'
                    }}
                >
                    <p className="trailer-half font-size--3">For community awareness within the US about air quality information in your area from the EPA, click on the map or search below.</p>

                    { children }

                </div>

                
            </div>

        </div>
    )
}

export default Sidebar
