import LineChartCom from './lineChart';
import TextView from './text';

const PROTO_CART_TYPE = {
  // 文本
  TEXT: 1,
  // 折线图
  LINE_CHART: 2,
  // 柱状图
  BAR_CHART: 3,
};

export const PROTO_CARD_LIST = [
  {
    type: PROTO_CART_TYPE.TEXT,
    label: '文本',
    style: {
      width: 200,
      height: 28,
      fontWeight: 400,
      letterSpacing: 0,
    },
  },
  {
    type: PROTO_CART_TYPE.LINE_CHART,
    label: '折线图',
    style: {
      width: 600,
      height: 300,
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
  },
  {
    type: PROTO_CART_TYPE.BAR_CHART,
    label: '柱状图',
    style: {},
  },
];

export const PROTO_CARD_COMPONENT = {
  [PROTO_CART_TYPE.TEXT]: TextView,
  [PROTO_CART_TYPE.LINE_CHART]: LineChartCom,
};
