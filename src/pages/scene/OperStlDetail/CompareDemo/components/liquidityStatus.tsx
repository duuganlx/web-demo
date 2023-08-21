import { DualAxes, DualAxesOptions, G2 } from '@antv/g2plot';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { useEffect, useRef } from 'react';
import { LIQUIDITY_DATA, LiquidityItem } from '../data';
import { formatNumber } from '../utils';

type DisplayDataItem = {
  datetime: string;
  marginTradingAmount: number;
  marginTradingCpr: number;
};

function toDisplayDataType(data: LiquidityItem[]): DisplayDataItem[] {
  const vertData: DisplayDataItem[] = [];

  data.forEach((item) => {
    const datetime = item.datetime;

    vertData.push({
      datetime: datetime,
      marginTradingAmount: item.marginTradingAmount,
      marginTradingCpr: item.marginTradingCpr,
    });
  });

  return vertData;
}

function renderG2PlotDualAxes(container: HTMLDivElement, data: DisplayDataItem[]) {
  const options: DualAxesOptions = {
    autoFit: true,
    data: [data, data],
    appendPadding: [40, 45, 40, 35],
    padding: [0, 0, 0, 0],
    xField: 'datetime',
    yField: ['marginTradingAmount', 'marginTradingCpr'],
    limitInPlot: false,
    slider: {
      height: 14,
      padding: [0, 40, -45, 40],
    },
    xAxis: {
      position: 'bottom',
      line: {
        style: {},
      },
    },
    yAxis: [
      {
        tickCount: 6,
        showLast: true,
        title: {
          text: '成交额',
          autoRotate: false,
          position: 'end',
          offset: 0,
        },
        line: {
          style: {
            stroke: '#000',
            lineWidth: 1,
          },
        },
        tickLine: {
          style: {
            stroke: '#000',
          },
        },
      },
      {
        tickCount: 6,
        showLast: true,
        title: {
          text: '百分比',
          autoRotate: false,
          position: 'end',
          offset: -10,
        },
        label: {
          formatter: (text: string) => {
            return text + ' %';
          },
        },
        line: {
          style: {
            stroke: '#000',
            lineWidth: 1,
          },
        },
        tickLine: {
          style: {
            stroke: '#000',
          },
        },
      },
    ],
    geometryOptions: [
      {
        geometry: 'column',
        color: '#2f54eb',
      },
      {
        geometry: 'line',
        color: 'red',
        // lineStyle: {
        //   stroke: 'green', // 优先级高于color
        // },
      },
    ],
    meta: {
      marginTradingAmount: {
        alias: '两融成交额(亿元)',
        formatter: (value: number) => {
          return formatNumber(value);
        },
      },
      marginTradingCpr: {
        alias: '两融成交额占A股成交额(%)',
        formatter: (value: number) => {
          return formatNumber(value);
        },
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'top',
    },
    tooltip: {
      follow: true,
      enterable: false,
      showCrosshairs: true,
      crosshairs: {
        type: 'x',
        follow: false,
      },
    },
    interactions: [{ type: 'test', enable: false }],
  };

  const dualAxes = new DualAxes(container, options);

  dualAxes.render();

  return dualAxes;
}

const LiquidityStatusView: React.FC = () => {
  const liquidityItems: LiquidityItem[] = LIQUIDITY_DATA;

  // ECharts
  const buySellOption: EChartsOption = {
    animation: true,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      orient: 'horizontal',
      align: 'left',
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
      label: {
        backgroundColor: '#777',
      },
    },
    grid: {
      left: '3%',
      right: '2%',
      bottom: '12px',
      top: '15%',
      containLabel: true,
    },
    dataZoom: [
      {
        id: 'dataZoom',
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
      {
        id: 'sliderZoom',
        show: false,
        type: 'slider',
        xAxisIndex: 0,
        bottom: '10px',
        start: 0,
        end: 100,
        showDetail: false,
      },
    ],
    xAxis: {
      type: 'category',
      data: liquidityItems.map((item) => item.datetime),
    },
    yAxis: [
      {
        type: 'value',
        name: '成交额',
        position: 'left',
        alignTicks: true,
        scale: true,
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '百分比',
        position: 'right',
        scale: true,
        alignTicks: true,
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: (value: number) => {
            return `${value.toFixed(1)} %`;
          },
        },
      },
    ],
    series: [
      {
        name: `两融成交额(亿元)`,
        type: 'bar',
        yAxisIndex: 0,
        color: 'rgb(36,74,171)',
        data: liquidityItems.map((item) => [item.datetime, item.marginTradingAmount]),
      },
      {
        name: `两融成交额占A股成交额(%)`,
        type: 'line',
        color: 'rgb(212,0,0)',
        yAxisIndex: 1,
        data: liquidityItems.map((item) => [item.datetime, item.marginTradingCpr]),
      },
    ],
  };

  // G2Plot
  const container = useRef<HTMLDivElement | null>(null);
  const chart = useRef<DualAxes | null>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    container.current.innerHTML = '';
    const displayData = toDisplayDataType(liquidityItems);
    chart.current = renderG2PlotDualAxes(container.current, displayData);

    G2.registerInteraction('test', {
      start: [
        {
          isEnable: (context) => {
            const element = context.event.data?.element as G2.Element;
            console.log('--1 ', element);
            return true;
          },
          trigger: 'plot:mousemove',
          action: (context) => {
            console.log('--2 ', context);
          },
        },
      ],
      end: [
        {
          trigger: 'plot:mouseleave',
          action: (context) => {
            console.log('--3 ', context);
          },
        },
      ],
    });

    chart.current.on('plot:click', (evt: any) => {
      console.log(evt);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div style={{ width: '426px', height: '350px' }} ref={container} />
      <div style={{ width: '426px', height: '350px' }}>
        <ReactECharts option={buySellOption} style={{ minHeight: '350px', marginTop: 8 }} />
      </div>
    </div>
  );
};

export default LiquidityStatusView;
