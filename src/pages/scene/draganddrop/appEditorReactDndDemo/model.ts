import { useCallback, useState } from 'react';
import { DragItemType, DragType } from './components/draggableViewProvider';

export interface StyleConfig {
  width: number;
  height: number;
  zIndex: number;
}

export interface ItemConfig {
  id: string;
  type: DragItemType;
  style: StyleConfig;
}

export interface DragOp {
  id: string;
  dragItemType: DragItemType;
  dragType: DragType;
}

export default function () {
  const [currentDrag, setCurrentDrag] = useState<DragOp>({
    id: '',
    dragItemType: DragItemType.Text,
    dragType: DragType.Add,
  });
  const [itemList, setItemList] = useState<ItemConfig[]>([]);

  const upCurrentDrag = useCallback((data: DragOp) => {
    setCurrentDrag(data);
  }, []);

  const upItemList = useCallback((data: ItemConfig[]) => {
    setItemList(data);
  }, []);

  return {
    currentDrag,
    itemList,
    upCurrentDrag,
    upItemList,
  };
}
