import { ControlOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { nanoid } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { FloatButton, Modal } from 'antd';
import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';
import GridView from './Grid';
import Shape from './Shape';
import DragComList from './dragComList';
import { PROTO_CARD_COMPONENT, PROTO_CARD_LIST } from './protoCards/protoCard';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditorModeViewProps {}

const EditorModeView: React.FC<EditorModeViewProps> = (props) => {
  console.log(props);

  const [isEditContentConfig, setIsEditContentConfig] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);

  const { curComponent, realtimeList, setRealtimeList, setCurComponent } = useModel(
    'eam.datainfo.cardMarket.model',
    (model) => ({
      curComponent: model.curComponent,
      realtimeList: model.realtimeList,
      setRealtimeList: model.upRealtimeList,
      setCurComponent: model.upCurComponent,
    }),
  );

  return (
    <>
      <div
        ref={editorRef}
        style={{ width: '100%', height: '60vh', backgroundColor: '#fff' }}
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
              cloneDeep(PROTO_CARD_LIST.find((item) => item.type === comType)) || {};
            component.id = nanoid();
            component.style.top = e.clientY - rectInfo.y;
            component.style.left = e.clientX - rectInfo.x;

            setRealtimeList([...realtimeList, component]);
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setCurComponent(null);
        }}
      >
        <GridView />
        {realtimeList.map((item, index) => {
          const Com = PROTO_CARD_COMPONENT[item.type];
          return (
            <Shape
              key={item.id}
              element={item}
              style={{ ...item.style, zIndex: realtimeList.length - index }}
              editorClient={editorRef.current?.getBoundingClientRect()}
              isEditState={true}
            >
              <Com {...item} />
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

      {curComponent && (
        <>
          <FloatButton.Group
            trigger="hover"
            type="primary"
            style={{ right: 94 }}
            icon={<ControlOutlined />}
          >
            <FloatButton
              icon={<EditOutlined />}
              tooltip="内容编辑"
              onClick={() => {
                setIsEditContentConfig(true);
              }}
            />
            <FloatButton
              icon={<DeleteOutlined />}
              tooltip="删除"
              onClick={() => {
                const newRealtimeList = realtimeList.filter((item) => item.id !== curComponent.id);
                setRealtimeList(newRealtimeList);
              }}
            />
          </FloatButton.Group>
        </>
      )}

      <Modal
        title="内容编辑"
        open={isEditContentConfig}
        destroyOnClose
        onOk={() => {
          setIsEditContentConfig(false);
        }}
        onCancel={() => {
          setIsEditContentConfig(false);
        }}
      >
        ss
      </Modal>
    </>
  );
};

export default EditorModeView;
