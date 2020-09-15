import React from 'react';

import { UIConfig } from '../../AppConfig';

const Sidebar:React.FC = ({
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
                'width': UIConfig["sidebar-width"],
                'boxSizing': 'border-box',
                'background': UIConfig["sidebar-background"],
                'color': '#fff',
                'zIndex': 5
            }}
        >
            <div>
                <div className="trailer-half">
                    <span className="font-size-2">Air Quality Aware</span>
                    <span className="right icon-ui-question cursor-pointer"></span>
                </div>

                <p className="trailer-half font-size--3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>

            { children }
        </div>
    )
}

export default Sidebar
