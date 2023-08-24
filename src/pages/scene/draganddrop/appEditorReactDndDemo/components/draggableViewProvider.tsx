import { useModel } from '@umijs/max';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export enum DragItemType {
  Text = 'Text',
  LineChart = 'LineChart',
}

export enum DragType {
  Add = 'Add',
  Adjust = 'Adjust',
}

export interface ItemConfig {
  id: string;
  type: DragItemType;
}

interface DragItem extends ItemConfig {
  index: number;
}

interface DraggableExtraOption {
  index: number;
  selectingItem: ItemConfig | null;
  setSelectingItem: (o: ItemConfig | null) => void;
}

interface useDropCollectedProps {
  isOver: boolean;
}

function moveToIndex(dragIndex: number, hoverIndex: number, itemList: ItemConfig[]) {
  const tmpItemList = [...itemList];

  tmpItemList.splice(dragIndex, 1);
  tmpItemList.splice(hoverIndex, 0, itemList[dragIndex]);

  return tmpItemList;
}

interface DraggableViewProps {
  itemcfg: ItemConfig;
  children: React.ReactNode;
  option: DraggableExtraOption;
}

const DraggableView: React.FC<DraggableViewProps> = (props) => {
  const { itemcfg, option, children } = props;
  const { index, selectingItem, setSelectingItem } = option;

  const { currentDrag, itemList, setCurrentDrag, setItemList } = useModel(
    'scene.draganddrop.appEditorReactDndDemo.model',
    (model) => ({
      itemList: model.itemList,
      currentDrag: model.currentDrag,
      setCurrentDrag: model.upCurrentDrag,
      setItemList: model.upItemList,
    }),
  );

  const [mDragIndex, setMDragIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DragItem, void, useDropCollectedProps>(
    () => ({
      accept: [DragItemType.Text, DragItemType.LineChart],
      drop: (_, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) return;

        switch (currentDrag.dragType) {
          case DragType.Add:
            console.log(currentDrag);
            break;
          case DragType.Adjust:
            setItemList(moveToIndex(mDragIndex, index, itemList));
            break;
          default:
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
      hover: (item: DragItem) => {
        // 拖拽悬停
        if (!ref.current) return;
        setMDragIndex(item.index);
      },
    }),
    [mDragIndex],
  );

  const [, drag] = useDrag(() => ({
    type: itemcfg.type,
    item: () => {
      return { ...itemcfg, index: index };
    },
    // collect: (monitor) => ({
    //   isDragging: !!monitor.isDragging(),
    // }),
  }));

  drag(drop(ref));
  return (
    <>
      <div style={{ width: '100%', height: 2, backgroundColor: isOver ? '#009a00' : '#ffffff' }} />
      <div
        ref={ref}
        style={{
          backgroundColor: 'white',
          padding: '0.5rem 0.5rem 0.5rem 0.5rem',
          marginBottom: '.5rem',
          cursor: 'move',
          border: selectingItem?.id === itemcfg.id ? '1px dashed gray' : '0px dashed gray',
        }}
        onDragStart={() => {
          setCurrentDrag({ id: itemcfg.id, dragItemType: itemcfg.type, dragType: DragType.Adjust });
        }}
        onClick={(e: any) => {
          e.stopPropagation();
          setSelectingItem(itemcfg);
        }}
      >
        {children}
      </div>
    </>
  );
};

export class DraggableViewProvider {
  static of(itemcfg: ItemConfig, option: DraggableExtraOption) {
    switch (itemcfg.type) {
      case DragItemType.Text:
        return (
          <DraggableView itemcfg={itemcfg} option={option}>
            <div key={itemcfg.id}>文本 {itemcfg.id}</div>
          </DraggableView>
        );
      case DragItemType.LineChart:
        return (
          <DraggableView itemcfg={itemcfg} option={option}>
            <div key={itemcfg.id}>折线图 {itemcfg.id}</div>
          </DraggableView>
        );
      default:
        return <div>未知组件</div>;
    }
  }
}
