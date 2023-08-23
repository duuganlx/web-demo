import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';
import { Button, Space } from 'antd';
import { DIRECTION_POINTS, calculatePointPosition, getDirectionPointStyle } from '../common';
import { CardConfig } from './protoCard';

export type ShapeConfig = {
  id: string;
  canvasHeight: number; // 画布高度
  canvasWidth: number; // 画布宽度
};

interface ShapeProps {
  element: CardConfig;
  children: React.ReactNode;
  editorClient: any;

  isEditState: boolean;
}

const Shape: React.FC<ShapeProps> = (props) => {
  const { children, element, editorClient, isEditState } = props;
  const { style, canvasStyle } = element;

  const { curComponent, realtimeList, setRealtimeList, updateCurComponent, setCurComponent } =
    useModel('scene.draganddrop.visualDragDemo.model', (model) => ({
      curComponent: model.curComponent,
      realtimeList: model.realtimeList,
      setRealtimeList: model.upRealtimeList,
      updateCurComponent: model.updateCurComponent,
      setCurComponent: model.upCurComponent,
    }));

  const className = useEmotionCss(() => {
    return {
      position: 'absolute',

      '.shape-point': {
        position: 'absolute',
        background: '#fff',
        border: '1px solid #59c7f9',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        zIndex: 1,
      },

      '&.active': {
        outline: '1px solid #70c0ff',
        userSelect: 'none',
      },

      '&:hover': {
        cursor: 'move',
      },
    };
  });

  // 鼠标移动
  const handleMouseDownOnShape = (e: any) => {
    e.stopPropagation();
    setCurComponent(element);

    const _style = { ...style };
    // 鼠标按下时的位置
    const startPos = {
      x: e.clientX,
      y: e.clientY,
    };
    // 鼠标按下时组件的位置
    const startStyle = {
      top: Number(_style.top),
      left: Number(_style.left),
    };

    const move = (moveEvent: any) => {
      // 计算偏移量
      const offset = {
        x: moveEvent.clientX - startPos.x,
        y: moveEvent.clientY - startPos.y,
      };

      // todo 需要判断是否超出边界
      _style.left = offset.x + startStyle.left;
      _style.top = offset.y + startStyle.top;

      // 修改当前组件样式
      updateCurComponent(element, _style);
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  // 拖动缩放图纸的点
  const handleMouseDownOnPoint = (point: string, e: any) => {
    e.stopPropagation();
    e.preventDefault();

    // 获取画布位移信息
    const move = (moveEvent: any) => {
      // 实时鼠标位置
      const curPositon = {
        x: moveEvent.clientX - Math.round(editorClient.left),
        y: moveEvent.clientY - Math.round(editorClient.top),
      };

      const newStyle = calculatePointPosition(point, style, curPositon, canvasStyle!);
      // 修改当前组件样式
      updateCurComponent(element, newStyle);
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  return (
    <div
      className={className}
      style={style}
      onMouseDown={(e) => {
        if (!isEditState) {
          return;
        }
        handleMouseDownOnShape(e);
      }}
    >
      {isEditState && curComponent?.id === element.id ? (
        <>
          {DIRECTION_POINTS.map((item) => (
            <div
              key={item}
              className="shape-point"
              style={getDirectionPointStyle(item, style.width, style.height)}
              onMouseDown={(e) => {
                if (!isEditState) {
                  return;
                }
                handleMouseDownOnPoint(item, e);
              }}
            />
          ))}
          <div style={{ position: 'absolute', bottom: '-35px', right: '10px' }}>
            <Space>
              <Button
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => {
                  const newRealtimeList = realtimeList.filter(
                    (item) => item.id !== curComponent.id,
                  );
                  setRealtimeList(newRealtimeList);
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => {
                  console.log('+1');
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<MinusOutlined />}
                onClick={() => {
                  console.log('-1');
                }}
              />
            </Space>
          </div>
        </>
      ) : null}
      {children}
    </div>
  );
};

export default Shape;
