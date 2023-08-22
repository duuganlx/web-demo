import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';

const DIRECTION_POINTS = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']; // 八个方向

// 鼠标样式
const CURSORS: Record<string, string> = {
  lt: 'nw-resize',
  t: 'n-resize',
  rt: 'ne-resize',
  r: 'e-resize',
  rb: 'se-resize',
  b: 's-resize',
  lb: 'sw-resize',
  l: 'w-resize',
};

// 左上缩放
function calculateLeftTop(style: any, curPositon: any) {
  const { width, height, top, left } = style;
  //   鼠标的实时位置不能超出容器
  const curX = Math.max(0, curPositon.x);
  const curY = Math.max(0, curPositon.y);
  const offsetX = left - curX;
  const offsetY = top - curY;
  style.width = width + offsetX;
  style.height = height + offsetY;
  style.top = curY;
  style.left = curX;
}

// 右上缩放
// function calculateRightTop(style: any, curPosition: any) {
//   const { height, top, left } = style;
//   //   鼠标的实时位置不能超出容器
//   const curX = Math.max(0, curPositon.x);
//   const curY = Math.max(0, curPositon.y);
//   const offsetX = curX - left;
// }

/**
 * @description: 获取八个方向点的样式
 * @param {*} point：方向点
 * @param {*} style：组件样式
 */
export const getDirectionPointStyle = (point: any, width: number, height: number) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const positionMap: Record<string, any[]> = {
    lt: [0, 0],
    rt: [width, 0],
    lb: [0, height],
    rb: [width, height],
    t: [halfWidth, 0],
    b: [halfWidth, height],
    l: [0, Math.floor(halfHeight)],
    r: [width, Math.floor(halfHeight)],
  };

  const position = positionMap[point];

  return {
    marginLeft: '-4px',
    marginTop: '-4px',
    left: `${position[0]}px`,
    top: `${position[1]}px`,
    cursor: CURSORS[point],
  };
};

interface ShapeProps {
  element: any;
  style: Record<string, any>;
  children: React.ReactNode;
  editorClient: any;

  isEditState: boolean;
}

const Shape: React.FC<ShapeProps> = (props) => {
  const { children, element, style, editorClient, isEditState } = props;

  // const active = false;

  const { curComponent, updateCurComponent, setCurComponent } = useModel(
    'scene.draganddrop.visualDragDemo.model',
    (model) => ({
      curComponent: model.curComponent,
      updateCurComponent: model.updateCurComponent,
      setCurComponent: model.upCurComponent,
    }),
  );

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

    const _style = { ...style };

    // 获取画布位移信息
    const move = (moveEvent: any) => {
      // 实时鼠标位置
      const curPositon = {
        x: moveEvent.clientX - Math.round(editorClient.left),
        y: moveEvent.clientY - Math.round(editorClient.top),
      };

      console.log(curPositon);
      console.log(point);

      switch (point) {
        case 'lt':
          calculateLeftTop(_style, curPositon);
          break;
        default:
          console.log('todo ', point);
      }

      console.log(_style);
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
      {isEditState && curComponent?.id === element.id
        ? DIRECTION_POINTS.map((item) => (
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
          ))
        : null}
      {children}
    </div>
  );
};

export default Shape;
