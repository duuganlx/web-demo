import { cloneDeep } from 'lodash';
import { useCallback, useState } from 'react';
import { CardConfig, StyleConfig } from './components/protoCard';

type canvasStyleItem = {
  height: number;
  width: number;
};

export default function () {
  const [curComponent, setCurComponent] = useState<CardConfig | null>(null);
  const [realtimeList, setRealtimeList] = useState<CardConfig[]>([]);
  const [canvasStyle, setCanvasStyle] = useState<canvasStyleItem>({ height: 0, width: 0 }); // 画布样式

  const upRealtimeList = useCallback((data: any[]) => {
    setRealtimeList(data);
  }, []);

  const upCurComponent = useCallback((data: any) => {
    setCurComponent(data);
  }, []);

  const upCanvasStyle = useCallback((data: any) => {
    setCanvasStyle(data);
  }, []);

  const updateCurComponent = useCallback(
    (comp: CardConfig, payload: StyleConfig) => {
      const { top, left, width, height, zIndex } = payload;
      const tmpCurComponent = cloneDeep(comp);
      const tmpRealtimeList = cloneDeep(realtimeList);

      if (width) tmpCurComponent.style.width = Math.round(width);
      if (height) tmpCurComponent.style.height = Math.round(height);
      if (top !== undefined) tmpCurComponent.style.top = Math.round(top);
      if (left !== undefined) tmpCurComponent.style.left = Math.round(left);
      if (zIndex !== undefined) tmpCurComponent.style.zIndex = Math.round(zIndex);
      const _index = tmpRealtimeList.findIndex((item) => item.id === tmpCurComponent.id);
      tmpRealtimeList.splice(_index, 1, tmpCurComponent);

      setRealtimeList(tmpRealtimeList);
    },
    [realtimeList],
  );

  return {
    curComponent,
    realtimeList,
    canvasStyle,
    upRealtimeList,
    upCurComponent,
    updateCurComponent,
    upCanvasStyle,
  };
}
