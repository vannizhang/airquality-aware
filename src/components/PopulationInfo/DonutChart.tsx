import React from 'react';
import * as d3 from 'd3';
import { numberFns } from 'helper-toolkit-ts';

export interface DonutChartDataItem {
    label: string;
    value: number;
    color?: string;
}

interface Props {
    data: DonutChartDataItem[];
    thicknessRatio?: number;
    // set true to create the donut chart looks like a gauge
    isHalfDonut?: boolean;
    totalPopulation?: number;
}

interface State {
    radius: number;
    centerTextLabel: string;
    centerTextValue: string;
}

const DefaultLabelForCenterText = 'Total Population';

export default class Donut extends React.PureComponent<Props, State> {
    // use 0 as the thicknessRatio to create a pei chart. If thicknessRatio is greater than 0 and smaller than 1, it will create a donut chart
    // the value of thicknessRatio should between 0 and 1
    private readonly DefaultThicknessRatio = 0.75;
    private readonly ClassName4ArcGroup = 'arc-group';
    private readonly ClassName4Arc = 'arc';
    private readonly ColorRamp = d3.schemeSet2;

    private containerRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            radius: 0,
            centerTextLabel: DefaultLabelForCenterText,
            centerTextValue: numberFns.numberWithCommas(props.totalPopulation),
        };
    }

    init(): void {
        const { data, isHalfDonut } = this.props;
        const container = this.containerRef.current;

        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const radius = Math.min(width, height) / 2;

        const translate = {
            width: width * 0.5,
            height: isHalfDonut ? height * 0.625 : height * 0.5,
        };

        d3.select(container)
            .append<SVGElement>('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('class', this.ClassName4ArcGroup)
            .attr(
                'transform',
                `translate(${translate.width}, ${translate.height})`
            );

        this.setState(
            {
                radius,
            },
            () => {
                if (data) {
                    this.draw();
                }
            }
        );
    }

    draw(): void {
        const component = this;

        const {
            ClassName4ArcGroup,
            ClassName4Arc,
            ColorRamp,
            DefaultThicknessRatio,
        } = this;

        const { data, thicknessRatio, isHalfDonut } = this.props;

        const { radius } = this.state;
        const container = this.containerRef.current;

        const arcGroup = d3.select(container).select(`.${ClassName4ArcGroup}`);

        const arc = d3
            .arc<any>()
            .innerRadius(
                thicknessRatio
                    ? radius * thicknessRatio
                    : radius * DefaultThicknessRatio
            )
            .outerRadius(radius);

        const pie = d3
            .pie<DonutChartDataItem>()
            .value(d=>d.value)
            .sort(null);

        if (isHalfDonut) {
            const anglesRange = 0.5 * Math.PI;

            pie.startAngle(anglesRange * -1).endAngle(anglesRange);
        }

        const arcs = arcGroup
            .selectAll(`.${ClassName4Arc}`)
            .remove()
            .exit()
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', ClassName4Arc);

        arcs.append('path')
            .attr('d', arc)
            .attr('data-label', (d: any, i: number) => {
                return d.data.label;
            })
            .attr('data-value', (d: any, i: number) => {
                return d.data.value;
            })
            .attr('fill', (d: any, i: number) => {
                return d.data.color || ColorRamp[i];
            })
            .on("mouseover", function(d){
                const label = d3.select(this).attr('data-label');
                const value = d3.select(this).attr('data-value');

                component.setState({
                    centerTextLabel: label,
                    centerTextValue: value + '%'
                })
            })
            .on("mouseout", (d)=>{
                component.setState({
                    centerTextLabel: DefaultLabelForCenterText,
                    centerTextValue: numberFns.numberWithCommas(component.props.totalPopulation)
                })
            });

        // arcGroup.append("text")
        //     .attr("class", "center-text-label")
        //     .attr("text-anchor", "middle")
        //         .attr('font-size', '.9rem')
        //         .attr('y', -5)
        //     .text(DefaultLabelForCenterText)
        //     .style('fill', 'rgba(255,255,255,.8)');

        // arcGroup.append("text")
        //     .attr("class", "center-text-value")
        //     .attr("text-anchor", "middle")
        //         .attr('font-size', '.9rem')
        //         .attr('y', 15)
        //     .text(numberFns.numberWithCommas(this.props.totalPopulation))
        //     .style('fill', 'rgba(255,255,255,.8)');
    }

    // conponentDidUpdate(prevProps: Props): void {
    //     console.log('donut chart did update')
    //     if (prevProps.data !== this.props.data) {
    //         console.log(prevProps.data, this.props.data)
    //         this.draw();
    //     }
    // }

    componentWillUpdate(){
        this.draw();
    }

    componentDidMount(): void {
        this.init();
    }

    render(): JSX.Element {
        return (
            <div
                ref={this.containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}
            >
                <div style={{
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': '100%',
                    'height': '100%',
                    'display': 'flex',
                    'justifyContent': 'center',
                    'alignItems': 'center',
                    'pointerEvents': 'none',
                }}>
                    <div className='text-center font-size--3'>
                        <span>{this.state.centerTextLabel}</span>
                        <br/>
                        <span>{this.state.centerTextValue}</span>
                    </div>
                </div>
                
            </div>
        );
    }
}