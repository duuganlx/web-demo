import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';
import { Button, Space } from 'antd';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemConfig } from '../model';

export enum DragItemType {
  Text = 'Text',
  LineChart = 'LineChart',
}

export enum DragType {
  Add = 'Add',
  Adjust = 'Adjust',
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

function insertToIndex(index: number, item: ItemConfig, itemList: ItemConfig[]) {
  const tmpItemList = [...itemList];

  tmpItemList.splice(index, 0, item);

  return tmpItemList;
}

function moveToIndex(dragIndex: number, hoverIndex: number, itemList: ItemConfig[]) {
  const tmpItemList = [...itemList];

  tmpItemList.splice(dragIndex, 1);
  tmpItemList.splice(hoverIndex, 0, itemList[dragIndex]);

  return tmpItemList;
}

export function generateItemConfig(id: string, type: DragItemType): ItemConfig | null {
  switch (type) {
    case DragItemType.Text:
      return { id, type, style: { width: 300, height: 80, zIndex: 1 } };
    case DragItemType.LineChart:
      return { id, type, style: { width: 700, height: 100, zIndex: 1 } };
    default:
      return null;
  }
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
    'demo.dnd.appEditorReactDndDemo.model',
    (model) => ({
      itemList: model.itemList,
      currentDrag: model.currentDrag,
      setCurrentDrag: model.upCurrentDrag,
      setItemList: model.upItemList,
    }),
  );

  const [mDragIndex, setMDragIndex] = useState<number>(-1);
  const [hwAdjustToggle, setHwAdjustToggle] = useState<boolean>(false); // true: height, false: width

  const ref = useRef<HTMLDivElement>(null);

  const className = useEmotionCss(() => {
    return {
      margin: '0 3px',

      '.indicator': {
        width: '100%',
        height: 2,
      },

      '.children-wrapper': {
        backgroundColor: 'white',
        padding: '0.5rem 0.5rem 0.5rem 0.5rem',
        cursor: 'move',
        border: selectingItem?.id === itemcfg.id ? '1px dashed gray' : '1px dashed #e6f7ff',
        position: 'relative',
      },

      '.op-wrapper': {
        zIndex: 100,
        position: 'absolute',
        bottom: '-15px',
        right: '10px',
      },
    };
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, useDropCollectedProps>(
    () => ({
      accept: [DragItemType.Text, DragItemType.LineChart],
      drop: (_, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) return;

        if (currentDrag.dragType === DragType.Add) {
          const item = generateItemConfig(currentDrag.id, currentDrag.dragItemType);

          if (!item) return;

          const newItemList = insertToIndex(index, item, itemList);
          setItemList(newItemList);
        } else if (currentDrag.dragType === DragType.Adjust) {
          const newItemList = moveToIndex(mDragIndex, index, itemList);
          setItemList(newItemList);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
      hover: (item: DragItem) => {
        // 拖拽悬停
        if (!ref.current) return;
        setMDragIndex(item.index ?? -1);
      },
    }),
    [mDragIndex, currentDrag, itemList],
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

  let isTop: boolean = true;
  if (mDragIndex === -1) {
    isTop = true;
  } else if (mDragIndex < index) {
    isTop = false;
  } else {
    isTop = true;
  }

  drag(drop(ref));
  return (
    <div className={className}>
      <div
        className="indicator"
        style={{
          backgroundColor: isOver && isTop ? '#009a00' : '#e6f7ff',
        }}
      />
      <div
        ref={ref}
        className="children-wrapper"
        onDragStart={() => {
          setCurrentDrag({ id: itemcfg.id, dragItemType: itemcfg.type, dragType: DragType.Adjust });
        }}
        onClick={(e: any) => {
          e.stopPropagation();
          setSelectingItem(itemcfg);
        }}
      >
        {children}

        {selectingItem?.id === itemcfg.id ? (
          <div className="op-wrapper">
            <Space>
              <Button
                danger
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => {
                  const newItemList = itemList.filter((item) => item.id !== itemcfg.id);

                  setItemList(newItemList);
                }}
              />
              <Button
                type={hwAdjustToggle ? 'primary' : 'default'}
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => {
                  const newItemList = itemList.map((item) => {
                    if (hwAdjustToggle) {
                      if (item.id === itemcfg.id) {
                        return {
                          ...item,
                          style: {
                            ...item.style,
                            height: item.style.height + 10,
                          },
                        };
                      }
                    } else {
                      if (item.id === itemcfg.id) {
                        return {
                          ...item,
                          style: {
                            ...item.style,
                            width: item.style.width + 10,
                          },
                        };
                      }
                    }
                    return item;
                  });

                  setItemList(newItemList);
                }}
              />
              <Button
                type={hwAdjustToggle ? 'primary' : 'default'}
                shape="circle"
                icon={<MinusOutlined />}
                onClick={() => {
                  const newItemList = itemList.map((item) => {
                    if (hwAdjustToggle) {
                      if (item.id === itemcfg.id) {
                        return {
                          ...item,
                          style: {
                            ...item.style,
                            height: item.style.height - 10,
                          },
                        };
                      }
                    } else {
                      if (item.id === itemcfg.id) {
                        return {
                          ...item,
                          style: {
                            ...item.style,
                            width: item.style.width - 10,
                          },
                        };
                      }
                    }
                    return item;
                  });

                  setItemList(newItemList);
                }}
              />
              <Button
                className="hw-adjust-toggle-btn"
                type={hwAdjustToggle ? 'primary' : 'default'}
                shape="circle"
                onClick={() => {
                  setHwAdjustToggle(!hwAdjustToggle);
                }}
              >
                {hwAdjustToggle ? '高' : '宽'}
              </Button>
            </Space>
          </div>
        ) : null}
      </div>
      <div
        className="indicator"
        style={{
          backgroundColor: isOver && !isTop ? '#009a00' : '#e6f7ff',
        }}
      />
    </div>
  );
};

export class DraggableViewProvider {
  static of(itemcfg: ItemConfig, option: DraggableExtraOption) {
    switch (itemcfg.type) {
      case DragItemType.Text:
        return (
          <DraggableView itemcfg={itemcfg} option={option}>
            <div key={itemcfg.id} style={itemcfg.style}>
              文本 {itemcfg.id}
            </div>
          </DraggableView>
        );
      case DragItemType.LineChart:
        return (
          <DraggableView itemcfg={itemcfg} option={option}>
            <div key={itemcfg.id} style={itemcfg.style}>
              折线图 {itemcfg.id}
            </div>
          </DraggableView>
        );
      default:
        return <div>未知组件</div>;
    }
  }
}
