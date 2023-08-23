import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { LineChartCardConfig } from '../protoCard';

const LineChartCom: React.FC<LineChartCardConfig> = (props) => {
  const { style, xAxis, yAxis, series } = props;

  const echartsOptions: EChartsOption = {
    grid: { top: 50, right: 8, bottom: 24, left: 36 },
    xAxis: xAxis,
    yAxis: yAxis,
    series: series,
  };

  return (
    <ReactECharts
      option={echartsOptions}
      style={{ width: `${style.width}px`, height: `${style.height}px`, backgroundColor: '#fff' }}
    />
  );
};

export default LineChartCom;
