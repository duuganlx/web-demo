import EChartsDemoView from './components/echartsdemo';
import G2PlotDemoView from './components/g2plotdemo';

const CompareDemo: React.FC = () => {
  return (
    <>
      <G2PlotDemoView />
      <div style={{ width: '100%', height: '1px', border: '1px solid black', margin: '10px 0' }} />
      <EChartsDemoView />
    </>
  );
};

export default CompareDemo;
