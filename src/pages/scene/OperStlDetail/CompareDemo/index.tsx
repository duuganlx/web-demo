import EChartsDemoView from './components/echartsdemo';
import G2DemoView from './components/g2demo';
import G2PlotDemoView from './components/g2plotdemo';
import LiquidityStatusView from './components/liquidityStatus';
import { generateBalancesData } from './data';

const CompareDemo: React.FC = () => {
  // const data = BALANCES_DATA;
  const data = generateBalancesData(100);

  // console.log(data);
  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <LiquidityStatusView />
      </div>

      <div>
        <G2DemoView balancesData={data} />
        <div
          style={{ width: '100%', height: '1px', border: '1px solid #d9d9d9', margin: '10px 0' }}
        />
        <G2PlotDemoView balancesData={data} />
        <div
          style={{ width: '100%', height: '1px', border: '1px solid #d9d9d9', margin: '10px 0' }}
        />
        <EChartsDemoView balancesData={data} />
      </div>
    </>
  );
};

export default CompareDemo;
