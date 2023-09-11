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
function calculateLeftTop(_style: StyleConfig, curPosition: { x: number; y: number }) {
  const { width, height, top = 0, left = 0 } = _style;

  const curX = Math.max(0, curPosition.x);
  const curY = Math.max(0, curPosition.y);
  const offsetX = left - curX;
  const offsetY = top - curY;

  _style.width = width + offsetX;
  _style.height = height + offsetY;
  _style.top = curY;
  _style.left = curX;
}

// 右上缩放
function calculateRightTop(
  _style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { height, top, left = 0 } = _style;

  const curX = Math.max(0, Math.min(canvasStyle.width, curPosition.x));
  const curY = Math.max(0, curPosition.y);
  const offsetX = curX - left;
  const offsetY = top! - curY;

  _style.width = offsetX;
  _style.height = height + offsetY;
  _style.top = curY;
}

// 右下缩放
function calculateRightBottom(
  _style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { top, left } = _style;

  const curX = Math.max(0, Math.min(canvasStyle.width, curPosition.x));
  const curY = Math.max(0, Math.min(canvasStyle.height, curPosition.y));
  const offsetX = curX - left!;
  const offsetY = curY - top!;

  _style.width = offsetX;
  _style.height = offsetY;
}

// 左下缩放
function calculateLeftBottom(
  _style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { width, top, left } = _style;

  const curX = Math.max(0, curPosition.x);
  const curY = Math.max(0, Math.min(canvasStyle.height, curPosition.y));
  const offsetX = left! - curX;
  const offsetY = curY - top!;

  _style.width = width + offsetX;
  _style.height = offsetY;
  _style.left = curX;
}

// 上缩放
function calculateTop(_style: StyleConfig, curPosition: { x: number; y: number }) {
  const { height, top = 0 } = _style;

  const curY = Math.max(0, curPosition.y);
  const offsetY = top - curY;

  _style.height = height + offsetY;
  _style.top = curY;
}

// 右缩放
function calculateRight(
  _style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { width } = canvasStyle;
  if (curPosition.x > width) return;

  const offsetX = curPosition.x - _style.left!;

  _style.width = offsetX;
}

// 下缩放
function calculateBottom(
  _style: StyleConfig,
  curPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  const { height } = canvasStyle;
  if (curPosition.y > height) return;

  _style.height = curPosition.y - _style.top!;
}

// 左缩放
function calculateLeft(_style: StyleConfig, curPosition: { x: number; y: number }) {
  const { width, left } = _style;

  if (curPosition.x < 0) return;

  const offsetX = left! - curPosition.x;

  _style.width = width + offsetX;
  _style.left = curPosition.x;
}

export function calculatePointPosition(
  point: string,
  _style: StyleConfig,
  cursorPosition: { x: number; y: number },
  canvasStyle: Pick<StyleConfig, 'height' | 'width'>,
) {
  switch (point) {
    case 'lt':
      return calculateLeftTop(_style, cursorPosition);
    case 't':
      return calculateTop(_style, cursorPosition);
    case 'rt':
      return calculateRightTop(_style, cursorPosition, canvasStyle);
    case 'r':
      return calculateRight(_style, cursorPosition, canvasStyle);
    case 'rb':
      return calculateRightBottom(_style, cursorPosition, canvasStyle);
    case 'b':
      return calculateBottom(_style, cursorPosition, canvasStyle);
    case 'lb':
      return calculateLeftBottom(_style, cursorPosition, canvasStyle);
    case 'l':
      return calculateLeft(_style, cursorPosition);
    default:
  }
}
