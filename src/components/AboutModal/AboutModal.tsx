import './style.scss';
import React, { useEffect } from 'react';
import { modal, bus } from 'calcite-web/dist/js/calcite-web.min.js';

type Props = {
    isOpen: boolean;
    onCloseHandler: ()=>void;
};

const ModalID = 'about';

const About: React.FC<Props> = ({ 
    isOpen,
    onCloseHandler
}: Props) => {

    useEffect(() => {
        modal();
        // bus.emit('modal:open', {id: "about"})
    }, []);

    useEffect(() => {
        if (isOpen) {
            bus.emit('modal:open', { id: ModalID });
        } else {
            bus.emit('modal:close');
        }
    }, [ isOpen ]);

    return (
        <div
            className="js-modal modal-overlay about-modal"
            data-modal={ModalID}
        >
            <div
                className="modal-content column-16"
                role="dialog"
                aria-labelledby="modal"
            >
                <div className="close-btn" onClick={onCloseHandler}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                    >
                        <path d="M18.01 6.697L12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z" />
                    </svg>
                </div>

                <div>
                    <h4>About this app</h4>

                    <p>The Air Quality Aware app is intended to provide information about the current conditions of air quality in the United States, along with the potential human health impacts. The data shown here from the <a href="https://livingatlas.arcgis.com/en/home/" target="_blank">Living Atlas</a> are authoritative U.S. government sources, including:</p>

                    <ul>
                        <li>The Environmental Protection Agency <a href="https://www.airnow.gov/" target="_blank">AirNow</a> program for current and future Air Quality Index information.</li>
                        <li>The National Weather Service <a href="https://www.arcgis.com/home/item.html?id=47ed83c3b4f943118e848fbfc33d119e" target="_blank">wind forecast</a>.  </li>
                        <li>U.S. Census - derived <a href="" target="_blank">American Community Survey</a> demographic data, along with variables derived by Esri.</li>
                    </ul>
                </div>

                <div>
                    <h4>Use this app</h4>

                    <p>Click on a location in the U.S. to see the AQI (including ozone and particulate matter) for now, later today, and tomorrow.</p>

                    <p>The National Weather Service’s 72-hour forecast for wind will also be displayed. Scroll down the page and find information for the same Census Tract on racial composition and other at-risk populations for degraded air quality.</p>

                    <p>This app was designed by Esri’s <a href="https://www.esri.com/arcgis-blog/author/dpisut/" target="_blank">Dan Pisut</a>, <a href="https://www.esri.com/arcgis-blog/author/emeriam/" target="_blank">Emily Meriam</a> and <a href="https://github.com/vannizhang" target="_blank">Jinnan Zhang</a>. The source code for the app can be found on <a href="https://github.com/vannizhang/airquality-aware" target="_blank">GitHub</a>.  </p>
                </div>
                
            </div>
        </div>
    );
};

export default About;