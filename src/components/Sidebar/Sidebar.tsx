import React from 'react';

import { UIConfig } from '../../AppConfig';

type Props = {
    infoBtnOnClick: ()=>void;
}

const Sidebar:React.FC<Props> = ({
    infoBtnOnClick,
    children
}) => {
    return (
        <div
            style={{
                'position': 'absolute',
                'right': 0,
                'top': 0,
                'height': '100%',
                'padding': '1rem',
                'overflowY': 'auto',
                'overflowX': 'hidden',
                'width': UIConfig["sidebar-width"],
                'boxSizing': 'border-box',
                'background': UIConfig["sidebar-background"],
                'color': UIConfig["text-color"],
                'zIndex': 5
            }}
        >
            <div>
                <div className="trailer-half">
                    <span className="font-size-2">Air Quality Aware</span>
                    <span className="right icon-ui-question cursor-pointer" onClick={infoBtnOnClick}></span>
                </div>

                <p className="trailer-half font-size--3">For community awareness within the US about air quality in your area, click on the map or search below</p>
            </div>

            { children }
        </div>
    )
}

export default Sidebar
