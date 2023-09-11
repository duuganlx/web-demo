import { nanoid } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useDrag } from 'react-dnd';
import { DragItemType, DragType } from './draggableViewProvider';

interface LeftPanelItemProps {
  label: string;
  type: DragItemType;
}

const LeftPanelItem: React.FC<LeftPanelItemProps> = (props) => {
  let { label, type } = props;

  const { setCurrentDrag } = useModel('demo.dnd.appEditorReactDndDemo.model', (model) => ({
    setCurrentDrag: model.upCurrentDrag,
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDrag = () => {
    setCurrentDrag({ id: nanoid(), dragItemType: type, dragType: DragType.Add });
  };

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        height: '50px',
        width: '100px',
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ddd',
        cursor: 'grab',
      }}
      onDragStart={handleDrag}
    >
      <div>{label}</div>
    </div>
  );
};

export default LeftPanelItem;
