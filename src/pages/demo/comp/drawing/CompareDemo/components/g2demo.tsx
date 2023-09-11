import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { BalanceItem } from '../data';

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
  ori: BalanceItem[];
};

function toDisplayDataType(data: BalanceItem[]) {
  const vertData: DisplayDataItem = {
    line: [],
    column: [],
    ori: [],
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

    vertData.ori.push({
      ...item,
      tradeDate: tradeDate,
    });
  });

  return vertData;
}

function renderG2Demo(container: HTMLDivElement, data: DisplayDataItem) {
  const chart = new Chart({
    container,
    // width: 800,
    // height: 300,
    autoFit: true,
    theme: 'classic',
    // 橙色部分大小
    paddingLeft: 50,
    paddingBottom: 40,
    paddingRight: 30,
    paddingTop: 20,
    // 蓝色部分大小
    marginLeft: 40,
    marginTop: 30,
    marginRight: 20,
    marginBottom: 10,
    // 红色部分大小
    insetLeft: 10,
    insetTop: 20,
    insetRight: 30,
    insetBottom: 10,
  });

  // 图像样式
  // chart
  //   .style('viewFill', '#4e79a7') // 设置视图区域样式
  //   .style('plotFill', '#f28e2c') // 绘制区域样式
  //   .style('mainFill', '#e15759') // 主区域样式
  //   .style('contentFill', '#76b7b2'); // 内容区域样式

  // 分组
  chart
    .line()
    .data(data.line)
    .encode('x', { type: 'field', value: 'tradeDate' })
    .encode('y', 'value')
    .encode('series', 'category')
    .encode('color', 'category')
    .tooltip({
      title: 'tradeDate',
      items: [
        (d) => {
          // console.log(d);

          return {
            // color: 'yellow',
            name: `${d.caegory}=1`, // 未生效
            value: (+d.value).toFixed(2),
          };
        },
      ],
    })
    .legend('color', {
      width: 180,
      style: {
        // itemLabel: (datum: any) => { // 未生效
        //   console.log(datum);

        //   return 'xxx';
        // },
        itemLabel: 'xxx', // 未生效
        itemLabelFontSize: 18,
      },
    })
    .axis('y', { line: true, title: '盈亏(%)', labelFormatter: '.1%' })
    .axis('x', {
      line: true,
      arrow: false,
      tickCount: 5,
      transform: true,
      labelAutoHide: (datum: any, index: any, data: any) => {
        console.log(datum, index, data);
        return 0;
      },
      style: { labelAlign: 'horizontal' },
    });

  // =======================================[begin]=============================================
  // 使用分组方式
  // chart.axis('y', { title: '盈亏(%)', labelFormatter: '.1%' });

  // chart
  //   .line()
  //   .data(data.ori)
  //   .encode('x', 'tradeDate')
  //   .encode('y', 'pnl')
  //   .encode('color', '#e15759');

  // chart
  //   .line()
  //   .data(data.ori)
  //   .encode('x', 'tradeDate')
  //   .encode('y', 'bmPnl')
  //   .encode('color', '#76b7b2');

  // chart
  //   .line()
  //   .data({
  //     type: 'inline',
  //     value: data.ori,
  //     transform: [
  //       {
  //         type: 'fold',
  //         fields: ['pnl', 'bmPnl'],
  //         key: 'diff',
  //         value: 'valdiff',
  //       },
  //     ],
  //   })
  //   .transform([{ type: 'diffY' }])
  //   .encode('x', 'tradeDate')
  //   .encode('y', 'valdiff')
  //   .encode('color', 'red');

  // =======================================[end]=============================================

  console.log(chart.options());
  chart
    .render()
    .then(() => {
      console.log('render success');
    })
    .catch((err) => {
      console.log(err);
    });

  return chart;
}

type G2DemoViewProps = {
  balancesData: BalanceItem[];
};

const G2DemoView: React.FC<G2DemoViewProps> = (props) => {
  const { balancesData } = props;

  const container = useRef<HTMLDivElement | null>(null);
  const chart = useRef<Chart | null>(null);

  const convertData = toDisplayDataType(balancesData);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    container.current.innerHTML = '';
    chart.current = renderG2Demo(container.current, convertData);
  }, []);

  return <div ref={container} style={{ width: '100%', height: '300px' }} />;
};

export default G2DemoView;
