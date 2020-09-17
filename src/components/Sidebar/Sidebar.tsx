import React, {
    useContext,
    useState
} from 'react';

import { AppContext } from '../../contexts/AppContextProvider';
import { UIConfig } from '../../AppConfig';

type Props = {
    isLoading: boolean;
    isOpen: boolean;
    toggleBtnOnclick: (val:boolean)=>void;
    infoBtnOnClick: ()=>void;
}

const Sidebar:React.FC<Props> = ({
    isLoading,
    isOpen,
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
            <div className='text-center padding-leader-quarter padding-trailer-quarter' onClick={toggleBtnOnclick.bind(this, !isOpen)}>
                { isOpen ? <span className='icon-ui-down'></span> : <span className='icon-ui-up'></span>}
            </div>
        )
    }

    return (
        <div
            style={{
                'position': 'absolute',
                'right': 0,
                'top': isOpen ? 0 : 'auto',
                'bottom': 0,
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
                    display: isOpen ? 'block' : 'none'
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
                        <span>data: EPA, NOAA, Census</span>
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
