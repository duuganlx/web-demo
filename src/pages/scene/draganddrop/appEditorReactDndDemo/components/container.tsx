import { useModel } from '@umijs/max';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { DragItemType, DragType, DraggableViewProvider, ItemConfig } from './draggableViewProvider';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContainerProps {}

const Container: React.FC<ContainerProps> = () => {
  const { itemList, currentDrag, setItemList } = useModel(
    'scene.draganddrop.appEditorReactDndDemo.model',
    (model) => ({
      itemList: model.itemList,
      currentDrag: model.currentDrag,
      setItemList: model.upItemList,
    }),
  );

  const [selectingItem, setSelectingItem] = useState<ItemConfig | null>(null);

  const [, drop] = useDrop(
    () => ({
      accept: [DragItemType.Text, DragItemType.LineChart],
      drop: (_, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) return;

        if (currentDrag.dragType === DragType.Add) {
          const item = {
            id: currentDrag.id,
            type: currentDrag.dragItemType,
          };
          setItemList([...itemList, item]);
        }
      },
      // collect: (monitor) => ({
      //   isOver: !!monitor.isOver(),
      // }),
    }),
    [currentDrag],
  );

  return (
    <div
      ref={drop}
      style={{ width: '85vw', height: '80vh', backgroundColor: '#e6f7ff' }}
      onClick={() => {
        setSelectingItem(null);
      }}
    >
      {itemList.map((item, index) =>
        DraggableViewProvider.of(item, {
          index: index,
          selectingItem: selectingItem,
          setSelectingItem: setSelectingItem,
        }),
      )}
    </div>
  );
};

export default Container;
