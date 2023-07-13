import { Datum, Mix, MixOptions } from '@antv/g2plot';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { BALANCES_DATA, BalanceItem } from '../data';
import { formatNumber } from '../utils';
type LineItem = {
  tradeDate: string;
  value: number;
  category: string;
};

type ColumnItem = {
  tradeDate: string;
  value: number;
  category2: string;
};

type DisplayDataItem = {
  line: LineItem[];
  column: ColumnItem[];
};

function toDisplayDataType(data: BalanceItem[]) {
  const vertData: DisplayDataItem = {
    line: [],
    column: [],
  };

  data.forEach((item) => {
    const tradeDate = dayjs(+item.tradeDate).format('YYYY-MM-DD');

    vertData.line.push(
      {
        tradeDate: tradeDate,
        value: item.pnl,
        category: 'pnl',
      },
      {
        tradeDate: tradeDate,
        value: item.bmPnl,
        category: 'bmPnl',
      },
    );
    vertData.column.push({
      tradeDate: tradeDate,
      value: item.commission,
      category2: 'commission',
    });
  });

  return vertData;
}

function renderG2PlotMix(container: HTMLDivElement, data: DisplayDataItem) {
  const mixOption: MixOptions = {
    syncViewPadding: true,
    autoFit: true,
    appendPadding: [30, 70, 25, 70],
    padding: [0, 0, 0, 0],
    legend: {
      category: {
        layout: 'horizontal',
        position: 'top',
        offsetX: -70,
      },
      category2: {
        layout: 'horizontal',
        position: 'top',
        offsetX: 100,
        offsetY: -40,
      },
    },
    tooltip: {
      shared: true,
      // BUG 无效配置
      formatter: (datum: Datum) => {
        console.log(datum);
        return { name: 'xx', value: 0 };
      },
      customItems: (originalItems: any) => {
        const newItems = originalItems.map((item: any) => {
          return {
            ...item,
            value: isNaN(+item.value) ? '-' : formatNumber(+item.value, { decLen: 2 }),
          };
        });
        return newItems;
      },
    },
    plots: [
      {
        region: { start: { x: 0, y: 0 }, end: { x: 1, y: 0.75 } },
        type: 'line',
        options: {
          data: data.line,
          xField: 'tradeDate',
          yField: 'value',
          seriesField: 'category',
          xAxis: false,
          yAxis: {
            title: {
              text: '盈亏(%)',
              position: 'center',
              offset: 60,
              style: {
                fontStyle: 'normal',
                fontSize: 13,
              },
            },
            label: {
              formatter: (v: string) => {
                return `${v}%`;
              },
            },
            verticalFactor: 1,
          },
          // padding: [0, 0, 0, 0],
          meta: {
            category: {
              formatter: (v) => {
                switch (v) {
                  case 'pnl':
                    return '累计盈亏(%)';
                  case 'bmPnl':
                    return '基准盈亏(%)';
                  default:
                    return v;
                }
              },
            },
          },
          annotations: [
            {
              id: 'markTradeDate',
              type: 'line',
              start: [100, 'min'],
              end: [100, 'max'],
              style: {
                lineDash: [4, 4],
                lineWidth: 2,
                stroke: 'red',
              },
            },
          ],
        },
      },
      {
        region: { start: { x: 0, y: 0.81 }, end: { x: 1, y: 1 } },
        type: 'column',
        options: {
          data: data.column,
          xField: 'tradeDate',
          yField: 'value',
          seriesField: 'category2',
          color: '#13c2c2',
          // padding: [0, 0, 0, 0],
          yAxis: {
            title: {
              text: '手续费(元)',
              position: 'center',
              // offset: 45,
              style: {
                fontStyle: 'normal',
                fontSize: 13,
              },
            },
            grid: null,
          },
          meta: {
            category2: {
              formatter: (v) => {
                switch (v) {
                  case 'commission':
                    return '手续费';
                  default:
                    return v;
                }
              },
            },
          },
          annotations: [
            {
              top: true, // TODO 不知道具体影响情况
              id: 'markTradeDate',
              type: 'line',
              start: [100, 'min'],
              end: [100, 'max'],
              style: {
                lineDash: [4, 4],
                lineWidth: 2,
                stroke: 'red',
              },
            },
          ],
        },
      },
    ],
  };

  const mix = new Mix(container, mixOption);

  mix.render();
  return mix;
}

function updateMarkTradeDate(xIndex: number, mix: Mix) {
  const lineView = mix.chart.views[0];
  const columneView = mix.chart.views[1];

  mix.removeAnnotations([{ id: 'markTradeDate' }]);
  mix.addAnnotations(
    [
      {
        id: 'markTradeDate',
        type: 'line',
        start: [xIndex, 'min'],
        end: [xIndex, 'max'],
        style: {
          lineDash: [4, 4],
          lineWidth: 2,
          stroke: 'red',
        },
      },
    ],
    lineView,
  );
  mix.addAnnotations(
    [
      {
        id: 'markTradeDate',
        type: 'line',
        start: [xIndex, 'min'],
        end: [xIndex, 'max'],
        style: {
          lineDash: [4, 4],
          lineWidth: 2,
          stroke: 'red',
        },
      },
    ],
    columneView,
  );
}

// 假设tradeDate传入的都是格式为2022-10-22
function calcXIndex(tradeDate: string, data: BalanceItem[]) {
  let xIndex = 0;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (dayjs(+item.tradeDate).format('YYYY-MM-DD') === tradeDate) {
      xIndex = i;
      break;
    }
  }

  return xIndex;
}

const G2PlotDemoView: React.FC = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const chart = useRef<Mix | null>(null);

  const [xIndex, setXIndex] = useState<number>(0);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    container.current.innerHTML = '';
    const convertData = toDisplayDataType(BALANCES_DATA);
    chart.current = renderG2PlotMix(container.current, convertData);

    // 注册事件
    chart.current.on('plot:click', (evt: any) => {
      const { x, y } = evt;
      const targetTradeDate = chart.current?.chart.getSnapRecords({ x, y })[0]._origin.tradeDate;
      const xi = calcXIndex(targetTradeDate, BALANCES_DATA);
      setXIndex(xi);
    });
  }, []);

  useEffect(() => {
    console.log(xIndex);
    if (chart.current) {
      updateMarkTradeDate(xIndex, chart.current);
    }
  }, [xIndex]);

  return <div ref={container} style={{ width: '100%', height: '300px' }}></div>;
};

export default G2PlotDemoView;
