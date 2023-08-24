import { Modal } from 'antd';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { useState } from 'react';
import { LineChartCardConfig } from '../protoCard';

const LineChartCom: React.FC<LineChartCardConfig> = (props) => {
  const { style, xAxis, yAxis, series } = props;

  const [contentEditMode, setContentEditMode] = useState<boolean>(false);

  const echartsOptions: EChartsOption = {
    grid: { top: 50, right: 8, bottom: 24, left: 36 },
    xAxis: xAxis,
    yAxis: yAxis,
    series: series,
  };

  return (
    <div
      onDoubleClick={() => {
        setContentEditMode(true);
      }}
    >
      <ReactECharts
        option={echartsOptions}
        style={{ width: `${style.width}px`, height: `${style.height}px`, backgroundColor: '#fff' }}
      />
      <Modal
        open={contentEditMode}
        onCancel={() => setContentEditMode(false)}
        onOk={() => setContentEditMode(false)}
      >
        修改图表配置....
      </Modal>
    </div>
  );
};

export default LineChartCom;
