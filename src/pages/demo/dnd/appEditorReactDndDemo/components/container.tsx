import { useModel } from '@umijs/max';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemConfig } from '../model';
import {
  DragItemType,
  DragType,
  DraggableViewProvider,
  generateItemConfig,
} from './draggableViewProvider';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContainerProps {}

const Container: React.FC<ContainerProps> = () => {
  const { itemList, currentDrag, setItemList } = useModel(
    'demo.dnd.appEditorReactDndDemo.model',
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
          const item = generateItemConfig(currentDrag.id, currentDrag.dragItemType);

          if (!item) return;

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
      style={{
        width: '85vw',
        height: '80vh',
        backgroundColor: '#e6f7ff',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
      }}
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
