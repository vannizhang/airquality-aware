import './style.scss';
import React from 'react';
import * as d3 from 'd3';
import { WindSpeedLayerFeature } from 'air-quality-aware';
import SectionHeader from '../SectionHeader/SectionHeader';
import { format } from 'date-fns';
import { UIConfig } from '../../AppConfig';

type WindChartProps = {
    data: WindSpeedLayerFeature[]
}

type LineChartDataItem = {
    key: number | Date;
    value: number;
    label?: string;
};

type LinChartProps = {
    data: LineChartDataItem[];
    margin?: {
        top: number,
        bottom: number,
        left: number, 
        right: number
    };
    // data value unit
    unit?: string;
    // d3 string specifier to format time, here is the detailed list of specifiers: https://github.com/d3/d3-time-format#locale_format
    timeFormatSpecifier?: string;
    // string template for tooltip content. e.g. `Sales Data for<b>{key}</b>: {value}`
    tooltipTemplate?:string;
    strokeColor?: string;
    dotColor?: string;
    shouldHideDots?: boolean;
    // dark mode will draw axis and ticks in light color so they can be more visible
    drakMode?: boolean;
    onHover?: (itemOnHover:LineChartDataItem)=>void
};

interface Scales {
    x: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
    y: d3.ScaleLinear<number, number>
}

interface TooltipPosition {
    top: number;
    left: number;
}


const WindspeedLookup = [
    "<1 mph","3 mph","7 mph","12 mph","17 mph","24 mph","30 mph","38 mph","46 mph","54 mph","63 mph","73 mph","95 mph","110 mph","130 mph","155 mph",">155 mph"
]

const LineChart:React.FC<LinChartProps> = ({
    data = [],
    margin = {
        top: 5, 
        right: 20, 
        bottom: 30, 
        left: 40
    },
    unit = '',
    timeFormatSpecifier = '',
    tooltipTemplate = '',
    strokeColor = '#56a5d8',
    dotColor = '#007ac2',
    shouldHideDots = false,
    drakMode = false,
    onHover = null
}: LinChartProps)=>{

    const ClassNames = {
        MainGroup: 'line-chart-main-group',
        LineGroup: 'line-group',
        LinePath: 'line-path',
        BackgroundRect: 'background-rect',
        VerticalRefLine: 'vertical-reference-line',
        RefDot: 'reference-dots'
    };

    const containerRef = React.useRef<HTMLDivElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);

    const [ width, setWidth ] = React.useState(0);
    const [ height, setHeight ] = React.useState(0);
    const [ scales, setScales ] = React.useState<Scales>(null);
    const [ itemOnHover, setItemOnHover ] = React.useState<LineChartDataItem>(null);
    const [ tooltipPosition, setTooltipPosition ] = React.useState<TooltipPosition>({ top: 0, left: 0 });
    
    let delayForOnHoverEvent:NodeJS.Timeout = null;

    const init = ()=>{

        const container = containerRef.current;
        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        const xScale = timeFormatSpecifier 
            ? d3.scaleTime()
                .range([0, width])
            : d3.scaleLinear()
                .range([0, width]);

        const yScale = d3.scaleLinear()
            .range([height, 0]);

        d3.select(container).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr('class', ClassNames.MainGroup + ` ${drakMode ? 'dark-mode': ''}`)
            .attr(
                "transform", 
                `translate(${margin.left}, ${margin.top})`
            );

        setWidth(width);
        setHeight(height);
        setScales({
            x: xScale,
            y: yScale
        });
    };

    const initBackgroundRect = ():void=>{
        const mainGroup = getMainGroup();

        const overlay = d3.select(`.${ClassNames.BackgroundRect}`);

        if(!overlay.size()){
            mainGroup.append("rect")
            .attr("class", ClassNames.BackgroundRect)
            .attr("width", width)
            .attr("height", height)
            .attr('fill', 'rgba(0,0,0,0)')
            .on("mouseleave", ()=>{
                handleItemOnHover();
            })
            .on("mousemove", function(){
                if(tooltipTemplate || onHover){
                    const mousePosX = d3.mouse(this)[0];
                    // console.log(mousePosX);
                    const itemOnHover = getItemByMousePos(mousePosX);
    
                    handleItemOnHover(itemOnHover);
                }
            });
        }
    };

    const initVerticalRefLine = ():void=>{
        const mainGroup = getMainGroup();

        const vRefLine = d3.select(`.${ClassNames.VerticalRefLine}`);

        if(!vRefLine.size()){
            mainGroup.append('line')
                .attr('class', ClassNames.VerticalRefLine)
                .attr('x1', tooltipPosition.left)
                .attr('y1', 0)
                .attr('x2', tooltipPosition.left)
                .attr('y2', height)
                // .style("display", "none")
                .attr('stroke-width', 0.5)
                .attr("stroke", drakMode ? "#eee" : "#999")
                .style("fill", "none");
        }
    }

    const getMainGroup = ():d3.Selection<HTMLDivElement, unknown, null, undefined> =>{
        const container = containerRef.current;
        return d3.select(container).select(`.${ClassNames.MainGroup}`);
    };

    const updateDomainForYScale = ():void =>{
        const { y } = scales;
        y.domain([ d3.min(data, d=>d.value), d3.max(data, d=>d.value) ]);
    };

    const drawYLabels = ():void =>{
        const { y } = scales;
        const mainGroup = getMainGroup();

        const yAxis = d3
            .axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat((force, index)=>{
                const tickValue = WindspeedLookup[+force];
                return tickValue;
            })

        const yAxisLabel = mainGroup.selectAll('.y.axis');
    
        if (!yAxisLabel.size()) {
            mainGroup
                .append('g')
                .attr('class', 'y axis')
                .call(yAxis);
        } else {
            yAxisLabel.call(yAxis);
        }
    };

    const updateDomainForXScale = ():void =>{
        const { x } = scales;
        x.domain(d3.extent(data, d=>d.key));
    };

    const drawXLabels = ():void =>{
        const { x } = scales;
        const mainGroup = getMainGroup();

        const xAxis = d3
        .axisBottom(x)
        .ticks(5);

        // format tick
        if(timeFormatSpecifier){
            const formatTime = d3.timeFormat(timeFormatSpecifier);

            xAxis.tickFormat((d:Date)=>{
                return formatTime(new Date(d));
            });
        } else {
            xAxis.tickFormat((d:Date)=>{
                const tickValue = d.toString();
                return tickValue;
            });
        }

        const xAxisLabel = mainGroup.selectAll('.x.axis');

        if (!xAxisLabel.size()) {
            mainGroup
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);
        } else {
            xAxisLabel
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);
        }
    };

    const draw = ():void =>{
        
        if(timeFormatSpecifier){
            data = data.map(d=>{
                d.key = new Date(d.key);
                return d;
            })
        }

        updateDomainForXScale();
        updateDomainForYScale();
        drawXLabels();
        drawYLabels();

        const { x, y } = scales;
        const mainGroup = getMainGroup();

        const valueline = d3.line<LineChartDataItem>()
            .curve(d3.curveMonotoneX)
            .x(d=>x(d.key))
            .y(d=>y(d.value));

        const lines = mainGroup.selectAll(`.${ClassNames.LinePath}`);
        
        // check the number of existing lines, if greater than 0; remove all existing ones
        if(lines.size()){
            lines.remove().exit();
        }

        mainGroup.append("path")
            .data([data])
            .attr("class", ClassNames.LinePath)
            .attr("d", valueline)
            .style('fill', 'none')
            .style('stroke', strokeColor)

        if(!shouldHideDots){

            const dots = mainGroup.selectAll(`.${ClassNames.RefDot}`);

            if(dots.size()){
                dots.remove().exit();
            }
    
            mainGroup.selectAll(`.${ClassNames.RefDot}`)
                .data(data)
            .enter().append("circle") // Uses the enter().append() method
                .attr("class", ClassNames.RefDot) // Assign a class for styling
                .attr("cx", d=> x(d.key))
                .attr("cy", d=> y(d.value))
                .attr("r", 4)
                .style('fill', dotColor);
        }

    };

    const updateVerticalRefLinePos = ():void=>{
        const mainGroup = getMainGroup();

        const vRefLine = mainGroup.select(`.${ClassNames.VerticalRefLine}`);

        const x = itemOnHover ? scales.x(itemOnHover.key) : 0;
        const opacity = itemOnHover ? 1 : 0;

        vRefLine
            .attr('x1', x)
            .attr('x2', x)
            .style('opacity', opacity);
    }

    const handleItemOnHover = (item?:LineChartDataItem)=>{

        clearTimeout(delayForOnHoverEvent);

        if(!item){
            delayForOnHoverEvent = global.setTimeout(()=>{
                setItemOnHover(null);
            }, 250);
        } else {
            setItemOnHover(item);
        }

    };

    const updateTooltipPosition = ():void=>{

        const container = containerRef.current;
        const tooltipDiv = tooltipRef.current;

        if(tooltipDiv){
            const containerWidth = container.offsetWidth;
            const tooltipDivWidth = tooltipDiv.offsetWidth;
            const tooltipDivHeight = tooltipDiv.offsetHeight;
    
            const top = -(tooltipDivHeight - margin.top);
            const xPosForItemOnHover = scales.x(itemOnHover.key) + margin.left;
    
            let left = xPosForItemOnHover + tooltipDivWidth / 2 >= width + margin.left
                    ? xPosForItemOnHover - tooltipDivWidth
                    : xPosForItemOnHover - tooltipDivWidth / 2;

            left = left >= margin.left ? left : margin.left;
    
            setTooltipPosition({ top, left });
        }

    }

    const getTooltip = ()=>{

        if(!itemOnHover || !tooltipTemplate){
            return null;
        }

        const { key, value, label } = itemOnHover;

        const tooltipContent = tooltipTemplate
            .replace(`{key}`, key ? key.toString() : '')
            .replace(`{value}`, value ? value.toString() : '')
            .replace(`{label}`, label ? label.toString() : '');

        return (
            <div 
                ref={tooltipRef}
                style={{
                    position: 'absolute',
                    top: tooltipPosition.top,
                    left: tooltipPosition.left,
                    background: 'rgba(0,0,0,0)',
                    color: UIConfig["text-color"],
                    padding: '.25rem',
                    pointerEvents: 'none',
                    fontSize: '.8rem'
                }}
                dangerouslySetInnerHTML={{
                    __html: tooltipContent
                }}
            >
            </div>
        );
    };

    const getItemByMousePos = (mousePosX:number):LineChartDataItem=>{

        let candidateItemByMousePosX:LineChartDataItem = null;
        // let tooltipPos = null;

        const { x } = scales;

        for(let i = 0, len = data.length; i < len; i++){

            const currItem = data[i];
            const currItemPos = x(currItem.key);

            const nextItem = data[i + 1] ? data[i + 1] : currItem;
            const nextItemPos = x(nextItem.key);

            if(mousePosX >= currItemPos && mousePosX <= nextItemPos){

                const distToCurrItem = Math.abs(mousePosX - currItemPos);
                const distToNextItem = Math.abs(mousePosX - nextItemPos);

                candidateItemByMousePosX = distToCurrItem < distToNextItem ? currItem : nextItem;

                break;
            }
        }

        return candidateItemByMousePosX;
    };

    React.useEffect(()=>{

        updateTooltipPosition();

        updateVerticalRefLinePos()

        if(onHover){
            onHover(itemOnHover);
        }
    }, [itemOnHover]);

    React.useEffect(()=>{
        
        if(!data || !height || !width || !scales ){
            return;
        }

        initBackgroundRect();

        initVerticalRefLine();

        // only call draw method once data, xScale, yScale, height and width are all ready
        draw();
    }, [ data, height, width, scales ]);

    // init x and y scale, svg and main group once the component is mounted
    React.useEffect(()=>{
        init();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}
        >
            { getTooltip() }
        </div>
    )
};

const WindspeedChart:React.FC<WindChartProps> = ({
    data
}) => {

    const formatData = ()=>{
        return data.map(d=>{
            const fromDate = format(new Date(d.attributes.fromdate), 'iii haaa');

            return {
                key: d.attributes.fromdate,
                value: d.attributes.force,
                label: `${fromDate}: ${WindspeedLookup[+d.attributes.force]}`
            }
        })
    };

    return data && data.length ? (
        <div className='leader-1 trailer-half'
            style={{
                width: '100%'
            }}
        >
            <SectionHeader 
                text='Wind Speed'
            />

            <div
                style={{
                    width: '100%',
                    height: '150px',
                }}
            >
                <LineChart 
                    data={formatData()}
                    shouldHideDots={true}
                    timeFormatSpecifier='%a %I%p'
                    strokeColor='#40C4ED'
                    tooltipTemplate={'{label}'}
                />
            </div>

        </div>
    ) : null;
}

export default WindspeedChart
