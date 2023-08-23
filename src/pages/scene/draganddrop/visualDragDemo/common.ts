import { StyleConfig } from './components/protoCard';

export const DIRECTION_POINTS = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']; // 八个方向

export const getDirectionPointStyle = (point: string, width: number, height: number) => {
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

  const cursorMap: Record<string, string> = {
    lt: 'nw-resize',
    t: 'n-resize',
    rt: 'ne-resize',
    r: 'e-resize',
    rb: 'se-resize',
    b: 's-resize',
    lb: 'sw-resize',
    l: 'w-resize',
  };

  return {
    marginLeft: '-4px',
    marginTop: '-4px',
    left: `${position[0]}px`,
    top: `${position[1]}px`,
    cursor: cursorMap[point],
  };
};

// 左上缩放
function calculateLeftTop(style: StyleConfig, curPosition: { x: number; y: number }) {
  const { width, height, top = 0, left = 0 } = style;

  const curX = Math.max(0, curPosition.x);
  const curY = Math.max(0, curPosition.y);
  const offsetX = left - curX;
  const offsetY = top - curY;

  return { ...style, width: width + offsetX, height: height + offsetY, top: curY, left: curX };
}

// 右上缩放
function calculateRightTop(
  style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { height, top, left } = style;
  //   鼠标的实时位置不能超出容器
  const curX = Math.max(0, Math.min(canvasStyle.width, curPosition.x));
  const curY = Math.max(0, curPosition.y);
  const offsetX = curX - left!;
  const offsetY = top! - curY;

  return {
    ...style,
    width: offsetX,
    height: height + offsetY,
    top: curY,
  };
}

// 右下缩放
function calculateRightBottom(
  style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { top, left } = style;
  //   鼠标的实时位置不能超出容器
  const curX = Math.max(0, Math.min(canvasStyle.width, curPosition.x));
  const curY = Math.max(0, Math.min(canvasStyle.height, curPosition.y));
  const offsetX = curX - left!;
  const offsetY = curY - top!;

  return {
    ...style,
    width: offsetX,
    height: offsetY,
  };
}

// 左下缩放
function calculateLeftBottom(
  style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { width, top, left } = style;
  //   鼠标的实时位置不能超出容器
  const curX = Math.max(0, curPosition.x);
  const curY = Math.max(0, Math.min(canvasStyle.height, curPosition.y));
  const offsetX = left! - curX;
  const offsetY = curY - top!;

  return {
    ...style,
    width: width + offsetX,
    height: offsetY,
    left: curX,
  };
}

// 上缩放
function calculateTop(style: StyleConfig, curPosition: { x: number; y: number }) {
  const { height, top = 0 } = style;

  if (curPosition.y < 0) {
    return style;
  }

  const offsetY = top - curPosition.y;

  return { ...style, height: height + offsetY, top: curPosition.y };
}

// 右缩放
function calculateRight(
  style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { width } = canvasStyle;
  if (curPosition.x > width) {
    return style;
  }

  const offsetX = curPosition.x - style.left!;

  return {
    ...style,
    width: offsetX,
  };
}

// 下缩放
function calculateBottom(
  style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { height } = canvasStyle;
  if (curPosition.y > height) {
    return style;
  }

  return {
    ...style,
    height: curPosition.y - style.top!,
  };
}

// 左缩放
function calculateLeft(style: StyleConfig, curPosition: { x: number; y: number }) {
  const { width, left } = style;
  if (curPosition.x < 0) {
    return style;
  }
  const offsetX = left! - curPosition.x;

  return {
    ...style,
    width: width + offsetX,
    left: curPosition.x,
  };
}

export function calculatePointPosition(
  point: string,
  style: StyleConfig,
  cursorPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  switch (point) {
    case 'lt':
      return calculateLeftTop(style, cursorPosition);
    case 't':
      return calculateTop(style, cursorPosition);
    case 'rt':
      return calculateRightTop(style, cursorPosition, canvasStyle);
    case 'r':
      return calculateRight(style, cursorPosition, canvasStyle);
    case 'rb':
      return calculateRightBottom(style, cursorPosition, canvasStyle);
    case 'b':
      return calculateBottom(style, cursorPosition, canvasStyle);
    case 'lb':
      return calculateLeftBottom(style, cursorPosition, canvasStyle);
    case 'l':
      return calculateLeft(style, cursorPosition);
    default:
      return { ...style };
  }
}
