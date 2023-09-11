// import { S2DataConfig } from '@antv/s2';
// import { SheetComponent } from '@antv/s2-react';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Slider } from 'antd';
import { useState } from 'react';

const S2Table: React.FC = () => {
  // const [widthPercentage, setWidthPercentage] = useState<number>(40);
  const [heightPercentage, setHeightPercentage] = useState<number>(40);

  // const data = genCommonDataArray(10);
  // console.log(data);

  // const s2DataCfg: S2DataConfig = {
  //   data: data as any[],
  //   fields: {
  //     columns: [
  //       'timestamp10',
  //       'temperature',
  //       'temp10Thousand',
  //       'temp100Million',
  //       'prevTemperature',
  //       'tempPnl',
  //     ],
  //   },
  //   meta: [
  //     { field: 'timestamp10', name: '日期' },
  //     { field: 'temperature', name: '温度(摄氏度)' },
  //     { field: 'prevTemperature', name: '前一温度(摄氏度)' },
  //     { field: 'temp10Thousand', name: '温度(万倍)' },
  //     { field: 'temp100Million', name: '日期(亿倍)' },
  //     { field: 'tempPnl', name: '变化幅度' },
  //   ],
  // };

  const className = useEmotionCss(() => {
    return {
      // margin: '3px auto 0',
      width: '80vw',
      height: '30vh',
      backgroundColor: 'white',
      // border: '1px ',
      // display: {},
      // '.ctlPanel': {},
    };
  });

  return (
    <div className={className}>
      <div className="display" style={{ width: '80vw', height: '10vh', backgroundColor: 'yellow' }}>
        {/* <SheetComponent
          sheetType="table"
          adaptive={{ width: true, height: false }}
          dataCfg={s2DataCfg}
          options={{}}
        /> */}
      </div>

      <div className="ctlPanel">
        <Slider
          min={1}
          max={100}
          onChange={(val: number) => {
            setHeightPercentage(val);
          }}
          value={heightPercentage}
        />
      </div>
    </div>
  );
};

export default S2Table;
