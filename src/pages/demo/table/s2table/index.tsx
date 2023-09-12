import { useEmotionCss } from '@ant-design/use-emotion-css';
import { S2DataConfig, SpreadSheet } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2/dist/style.min.css'; // 为了保证antv tooltip正常,一定要引入该样式
import { InputNumber, Slider } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { formatVal, genCommonDataArray } from '../../common';

const S2Table: React.FC = () => {
  const [heightOffset, setHeightOffset] = useState<number>(40);
  const [widthOffset, setWidthOffset] = useState<number>(40);

  const [data, setData] = useState<any[]>([]);

  const divRef = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<SpreadSheet>();

  useEffect(() => {
    // 数据获取
    const tmpData = genCommonDataArray(500);

    setData(tmpData);
  }, []);

  useEffect(() => {
    // 自适应宽高
    if (!divRef.current) return;
    const delay = 200; // 单位:ms

    const debounceRender = debounce((width, height) => {
      if (!s2Ref.current) return;

      s2Ref.current.changeSheetSize(width, height);
      s2Ref.current.render(false); // 不重新加载数据
    }, delay);

    const resizeObserver = new ResizeObserver(([entry] = []) => {
      const [size] = entry.borderBoxSize || [];

      debounceRender(size.inlineSize, size.blockSize);
    });

    resizeObserver.observe(divRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const s2DataCfg: S2DataConfig = {
    data: data as any[],
    fields: {
      columns: [
        'timestamp10',
        'prevTemperature',
        'temperature',
        'temp10Thousand',
        'temp100Million',
        'tempPnl',
      ],
    },
    meta: [
      {
        field: 'timestamp10',
        name: '日期',
        formatter: (v: any) => {
          return dayjs(+v * 1000).format('YYYY-MM-DD');
        },
      },
      { field: 'temperature', name: '温度(℃)', formatter: (v: any) => formatVal(v, 1, 2) },
      {
        field: 'prevTemperature',
        name: '前一温度(℃)',
        formatter: (v: any) => formatVal(v, 1, 2),
      },
      { field: 'temp10Thousand', name: '温度(万倍)', formatter: (v: any) => formatVal(v, 1, 2) },
      { field: 'temp100Million', name: '温度(亿倍)', formatter: (v: any) => formatVal(v, 1, 2) },
      {
        field: 'tempPnl',
        name: '变化率',
        formatter: (v: any) => {
          return `${+v * 100}`;
        },
      },
    ],
  };

  const className = useEmotionCss(() => {
    return {
      margin: '3px auto 0',
      width: '80vw',
      height: '500px',
      backgroundColor: 'white',
      position: 'relative',
      padding: '5px 4px',

      '.title-row': {
        height: '24px',
        display: 'flex',
        alignItems: 'center',

        '.bar': {
          background: '#3d6dd8',
          width: '4px',
          height: '100%',
        },
        '.title': {
          fontWeight: 'bold',
          fontSize: '16px',
          flex: '0 0 auto',
          margin: '0 10px 0 5px',
        },
      },
      '.monitor': {
        width: '100%',
        backgroundColor: '#fff1f0',
        height: `calc(100% - ${34 + 24}px)`,
        margin: '3px 0',
        border: '1px dashed #ffccc7',

        '.s2': {
          backgroundColor: '#f4ffb8',
        },
      },
      '.ctl-panel': {
        height: '34px',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        marginTop: '5px',
        // backgroundColor: '#e6fffb',

        '.ctl-panel-item': {
          display: 'flex',
          width: '300px',
          alignItems: 'center',
          marginRight: '20px',

          '.item-label': {
            fontSize: '18px',
          },

          '.item-label:after': {
            content: '":"',
            marginRight: '8px',
          },
          '.ant-slider': {
            flexGrow: 1,
            marginRight: '15px',
          },

          '.ant-input-number-wrapper': {
            '.ant-input-number': {
              width: '55px',

              '.ant-input-number-input-wrap > input': {
                padding: '4px 5px',
              },
            },
            '.ant-input-number-group-addon': {
              padding: '0 5px',
            },
          },
        },
      },
    };
  });
  const title = 'demo 1';

  return (
    <div className={className}>
      <div className="title-row">
        <div className="bar" />
        <div className="title">{title}</div>
      </div>
      <div className="monitor">
        <div
          className="s2"
          style={{
            height: `calc(100% - ${heightOffset}px)`,
            width: `calc(100% - ${widthOffset}px)`,
          }}
          ref={divRef}
        >
          <SheetComponent
            onMounted={(spreadsheet) => {
              s2Ref.current = spreadsheet;
            }}
            sheetType="table"
            adaptive={{ width: false, height: false, getContainer: () => divRef.current! }}
            dataCfg={s2DataCfg}
            options={{
              conditions: {
                text: [
                  {
                    field: /.*Pnl/,
                    mapping(val) {
                      if (+val > 0) {
                        return { fill: 'red' };
                      } else if (+val < 0) {
                        return { fill: 'green' };
                      } else {
                        return { fill: 'black' };
                      }
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </div>
      <div className="ctl-panel">
        <div className="ctl-panel-item">
          <div className="item-label">高度偏移</div>
          <Slider
            min={0}
            max={200}
            onChange={(val: number) => {
              setHeightOffset(val);
            }}
            value={heightOffset}
          />
          <InputNumber
            min={0}
            max={200}
            value={heightOffset}
            addonAfter="px"
            onChange={(val: any) => {
              setHeightOffset(+val);
            }}
          />
        </div>
        <div className="ctl-panel-item">
          <div className="item-label">宽度偏移</div>
          <Slider
            min={0}
            max={200}
            onChange={(val: number) => {
              setWidthOffset(val);
            }}
            value={widthOffset}
          />
          <InputNumber
            min={0}
            max={200}
            value={widthOffset}
            addonAfter="px"
            onChange={(val: any) => {
              setWidthOffset(+val);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default S2Table;
