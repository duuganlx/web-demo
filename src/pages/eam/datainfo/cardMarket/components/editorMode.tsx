import { ControlOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { nanoid } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { FloatButton } from 'antd';
import { cloneDeep } from 'lodash';
import { useRef } from 'react';
import TextView from '../template/Text';
import GridView from './Grid';
import Shape from './Shape';
import DragComList, { DRAG_COM_LIST } from './dragComList';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditorModeViewProps {}

const EditorModeView: React.FC<EditorModeViewProps> = (props) => {
  console.log(props);
  const editorRef = useRef<HTMLDivElement>(null);

  const { realtimeList, setRealtimeList } = useModel('eam.datainfo.cardMarket.model', (model) => ({
    realtimeList: model.realtimeList,
    setRealtimeList: model.upRealtimeList,
  }));

  return (
    <>
      <div
        ref={editorRef}
        style={{ width: '100%', height: '60vh', backgroundColor: '#fff' }}
        // onMouseDown={(e) => {
        //   console.log(e);
        // }}
        onDragOver={(e) => {
          // 处理鼠标拖拽移入
          e.preventDefault();
        }}
        onDrop={(e) => {
          // 处理鼠标拖拽松开
          e.preventDefault();
          e.stopPropagation();
          const comType = JSON.parse(e.dataTransfer.getData('comType'));
          const rectInfo = editorRef.current?.getBoundingClientRect();

          if (comType && rectInfo) {
            const component: any =
              cloneDeep(DRAG_COM_LIST.find((item) => item.type === comType)) || {};
            component.id = nanoid();
            component.style.top = e.clientY - rectInfo.y;
            component.style.left = e.clientX - rectInfo.x;

            setRealtimeList([...realtimeList, component]);
          }
        }}
      >
        <GridView />
        {realtimeList.map((item, index) => {
          return (
            <Shape
              key={item.id}
              element={item}
              style={{ ...item.style, zIndex: realtimeList.length - index }}
              editorClient={editorRef.current?.getBoundingClientRect()}
              isEditState={true}
            >
              <TextView key={item.id} style={{ ...item.style }} />
            </Shape>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          // background: '#595959',
          width: '100%',
          // height: '100px',
        }}
      >
        <DragComList />
      </div>
      <>
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 94 }}
          icon={<ControlOutlined />}
        >
          <FloatButton icon={<EditOutlined />} tooltip="内容编辑" />
          <FloatButton icon={<DeleteOutlined />} tooltip="删除" />
        </FloatButton.Group>
      </>
    </>
  );
};

export default EditorModeView;
