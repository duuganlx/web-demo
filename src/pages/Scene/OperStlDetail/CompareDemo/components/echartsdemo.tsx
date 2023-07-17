import dayjs from 'dayjs';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import { BalanceItem } from '../data';

type EChartsDemoViewProps = { balancesData: BalanceItem[] };

const EChartsDemoView: React.FC<EChartsDemoViewProps> = (props) => {
  const { balancesData } = props;

  const [tradeDate, setTradeDate] = useState<number>(0);

  const echartRef = React.useRef<ReactECharts>(null);

  useEffect(() => {
    // console.log('ECharts');
    if (echartRef.current) {
      const ech = echartRef.current.getEchartsInstance();

      ech.getZr().on('click', (event) => {
        const xIndex = ech.convertFromPixel({ seriesIndex: 0 }, [event.offsetX, event.offsetY])[0];

        if (!xIndex) {
          return;
        }
        if (balancesData[xIndex] === undefined) {
          return;
        }

        const targetTradeDate = +balancesData[xIndex].tradeDate / 1000;
        setTradeDate(targetTradeDate);
      });
    }
  }, []);

  const echartsOptions: EChartsOption = {
    grid: [
      {
        top: 29,
        left: 65,
        right: 30,
        // bottom: '35%',
        height: 170,
      },
      {
        top: '68%',
        left: 65,
        right: 30,
        // bottom: 45,
        height: 50,
      },
    ],
    legend: {
      orient: 'horizontal',
      top: '5px',
      align: 'right',
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
    xAxis: [
      {
        type: 'category',
        gridIndex: 0,
        triggerEvent: true,
        show: false,
        data: balancesData
          .map((item) => item.tradeDate)
          .map((item) => dayjs(+item).format('YYYY-MM-DD')),
      },
      {
        type: 'category',
        triggerEvent: true,
        gridIndex: 1,
        data: balancesData
          .map((item) => item.tradeDate)
          .map((item) => dayjs(+item).format('YYYY-MM-DD')),
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        nameLocation: 'middle',
        gridIndex: 0,
        position: 'left',
        alignTicks: true,
        axisLabel: {
          formatter: '{value}%',
          align: 'right',
        },
      },
      {
        type: 'value',
        name: '',
        gridIndex: 1,
        nameLocation: 'middle',
        position: 'left',
        alignTicks: true,
        axisLabel: {
          hideOverlap: true,
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'value',
        name: '盈亏(%)',
        nameLocation: 'middle',
        nameRotate: -90,
        gridIndex: 0,
        position: 'right',
        alignTicks: true,
      },
      {
        type: 'value',
        name: '手续费(元)',
        nameLocation: 'middle',
        nameRotate: -90,
        gridIndex: 1,
        position: 'right',
        alignTicks: true,
      },
    ],
    series: [
      {
        name: '累计盈亏',
        type: 'line',
        gridIndex: 0,
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: balancesData.map((item) => +(item.pnl?.toFixed(2) || 0)),
        markLine: {
          silent: 'true',
          symbol: 'none',
          lineStyle: {
            color: 'red',
          },
          label: {
            show: false,
          },
          data: [
            {
              xAxis: dayjs(tradeDate * 1000).format('YYYY-MM-DD'),
            },
          ],
        },
      },
      {
        name: '基准累计盈亏',
        type: 'line',
        gridIndex: 0,
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: balancesData.map((item) => +(item.bmPnl?.toFixed(2) || 0)),
      },
      {
        name: '手续费',
        type: 'bar',
        gridIndex: 1,
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: balancesData.map((item) => +(item.commission?.toFixed(2) || 0)),
        markLine: {
          silent: 'true',
          symbol: 'none',
          lineStyle: {
            color: 'red',
          },
          label: {
            show: false,
          },
          data: [
            {
              xAxis: dayjs(tradeDate * 1000).format('YYYY-MM-DD'),
            },
          ],
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  return (
    <ReactECharts
      ref={echartRef}
      option={echartsOptions}
      style={{ width: '100%', height: '300px' }}
    />
  );
};

export default EChartsDemoView;
