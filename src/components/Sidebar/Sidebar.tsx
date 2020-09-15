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
                'zIndex': 5
            }}
        >
            { children }
        </div>
    )
}

export default Sidebar
