import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from './components/container';
import { DragItemType } from './components/draggableViewProvider';
import LeftPanelItem from './components/leftPanelItem';

const AppEditorReactDndView: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* 组件区 */}
      <div style={{ backgroundColor: 'white' }}>
        <DndProvider backend={HTML5Backend}>
          <LeftPanelItem label={'文本'} type={DragItemType.Text} />
          <LeftPanelItem label={'折线图'} type={DragItemType.LineChart} />
        </DndProvider>
      </div>

      {/* 工作去 */}
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
    </div>
  );
};

export default AppEditorReactDndView;
