import { cloneDeep } from 'lodash';
import { useCallback, useState } from 'react';

export default function () {
  // const [curComponent, setCurComponent] = useState<any>(undefined);
  const [realtimeList, setRealtimeList] = useState<any[]>([]);

  const upRealtimeList = useCallback((data: any[]) => {
    setRealtimeList(data);
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
      const _index = realtimeList.findIndex((item: { id: any }) => item.id === tmpCurComponent.id);
      realtimeList.splice(_index, 1, tmpCurComponent);

      setRealtimeList(tmpRealtimeList);
    },
    [realtimeList],
  );

  return {
    // curComponent,
    realtimeList,
    upRealtimeList,
    // upCurComponent,
    updateCurComponent,
  };
}
