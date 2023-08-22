import ReactECharts, { EChartsOption } from 'echarts-for-react';

interface LineChartComProps {
  style: { width: number; height: number };
  // 以下都是echarts的配置项
  xAxis: any;
  yAxis: any;
  series: any;
}

const LineChartCom: React.FC<LineChartComProps> = (props) => {
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
