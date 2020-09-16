import React, {
    useContext,
    useState
} from 'react';

import { AppContext } from '../../contexts/AppContextProvider';
import { UIConfig } from '../../AppConfig';

type Props = {
    isLoading: boolean;
    infoBtnOnClick: ()=>void;
}

const Sidebar:React.FC<Props> = ({
    isLoading,
    infoBtnOnClick,
    children
}) => {

    const { isMobile } = useContext(AppContext);

    const [ isOpen, setIsOpen ] = useState<boolean>(true)

    const getToggleBtn = ()=>{
        if(!isMobile){
            return null;
        }

        return (
            <div className='text-center' onClick={setIsOpen.bind(this, !isOpen)}>
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
            { getToggleBtn() }

            <div
                style={{
                    display: isOpen ? 'block' : 'none'
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

        </div>
    )
}

export default Sidebar
