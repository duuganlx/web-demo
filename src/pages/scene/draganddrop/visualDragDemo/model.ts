import { cloneDeep } from 'lodash';
import { useCallback, useState } from 'react';
import { CardConfig } from './components/protoCard';

type canvasStyleItem = {
  height: number;
  width: number;
};

export default function () {
  const [curComponent, setCurComponent] = useState<any>(null);
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
    (comp: any, payload: any) => {
      const { top, left, width, height, rotate } = payload;
      const tmpCurComponent = cloneDeep(comp);
      const tmpRealtimeList = cloneDeep(realtimeList);

      if (top) tmpCurComponent.style.top = Math.round(top);
      if (left) tmpCurComponent.style.left = Math.round(left);
      if (width) tmpCurComponent.style.width = Math.round(width);
      if (height) tmpCurComponent.style.height = Math.round(height);
      if (rotate) tmpCurComponent.style.rotate = Math.round(rotate);
      const _index = realtimeList.findIndex((item) => item.id === tmpCurComponent.id);
      realtimeList.splice(_index, 1, tmpCurComponent);

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
