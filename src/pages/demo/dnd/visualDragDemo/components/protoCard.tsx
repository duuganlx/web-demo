import LineChartCom from './protoCards/lineChart';
import TextView from './protoCards/text';

// ============================ interface ============================
export interface StyleConfig {
  height: number; // 高度
  width: number; // 宽度
  left?: number; // 左边框到画布左边框的距离
  top?: number; // 上边框到画布上边框的距离
  zIndex?: number; // 层级
}

export interface CardConfig {
  id?: string;
  label: string;
  type: number;
  style: StyleConfig;
}

export interface TextCardConfig extends CardConfig {
  type: typeof PROTO_CART_TYPE.TEXT;
  style: StyleConfig & {
    fontWeight: number;
    letterSpacing: number;
  };
}

export interface LineChartCardConfig extends CardConfig {
  type: typeof PROTO_CART_TYPE.LINE_CHART;
  xAxis: {
    type: 'category';
    data: string[];
  };
  yAxis: {
    type: 'value';
  };
  series: {
    data: number[];
    type: 'line';
    smooth: boolean;
  }[];
}

// ============================ const ============================
const PROTO_CART_TYPE = {
  // 文本
  TEXT: 1,
  // 折线图
  LINE_CHART: 2,
};

export const PROTO_CARD_LIST = [
  {
    type: PROTO_CART_TYPE.TEXT,
    label: '文本',
    style: {
      width: 400,
      height: 200,
      fontWeight: 400,
      letterSpacing: 0,
    },
  } as TextCardConfig,
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
  } as LineChartCardConfig,
];

// ============================ function ============================
export function displayComponent(item: CardConfig) {
  switch (item.type) {
    case PROTO_CART_TYPE.TEXT:
      return <TextView {...(item as TextCardConfig)} />;
    case PROTO_CART_TYPE.LINE_CHART:
      return <LineChartCom {...(item as LineChartCardConfig)} />;
    default:
      return <>未知组件...</>;
  }
}
