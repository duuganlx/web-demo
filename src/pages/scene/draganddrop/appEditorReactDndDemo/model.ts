import { useCallback, useState } from 'react';
import { DragItemType, DragType, ItemConfig } from './components/draggableViewProvider';

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
