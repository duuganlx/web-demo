import { nanoid } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { cloneDeep } from 'lodash';
import { useEffect, useRef } from 'react';
import GridView from './Grid';
import Shape from './Shape';
import DragComList from './dragComList';
import { CardConfig, PROTO_CARD_LIST, displayComponent } from './protoCard';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditorModeViewProps {}

const EditorModeView: React.FC<EditorModeViewProps> = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const { realtimeList, setRealtimeList, setCurComponent, setCanvasStyle } = useModel(
    'demo.dnd.visualDragDemo.model',
    (model) => ({
      // curComponent: model.curComponent,
      realtimeList: model.realtimeList,
      setRealtimeList: model.upRealtimeList,
      setCurComponent: model.upCurComponent,
      setCanvasStyle: model.upCanvasStyle,
    }),
  );

  // 初次设定画布大小
  useEffect(() => {
    if (!editorRef.current) return;
    setCanvasStyle({
      height: editorRef.current.clientHeight,
      width: editorRef.current.clientWidth,
    });
  }, [editorRef]);

  // 监听画布大小变化
  window.addEventListener('resize', () => {
    if (!editorRef.current) return;

    setCanvasStyle({
      height: editorRef.current.clientHeight,
      width: editorRef.current.clientWidth,
    });
  });

  return (
    <>
      <div
        ref={editorRef}
        style={{ width: '95vw', height: '80vh', backgroundColor: '#fff' }}
        onDragOver={(e) => {
          // 处理鼠标拖拽移入
          e.preventDefault();
        }}
        onDrop={(e) => {
          // 处理鼠标拖拽松开，将组件添加到画布
          e.preventDefault();
          e.stopPropagation();

          const comType = +e.dataTransfer.getData('comType');
          const rectInfo = editorRef.current?.getBoundingClientRect();

          if (comType && rectInfo) {
            const component: CardConfig | undefined = cloneDeep(
              PROTO_CARD_LIST.find((item) => item.type === comType),
            );

            if (!component) return;

            component.id = nanoid();
            component.style.top = e.clientY - rectInfo.y;
            component.style.left = e.clientX - rectInfo.x;
            component.style.zIndex = realtimeList.length + 1;

            setRealtimeList([...realtimeList, component]);
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setCurComponent(null);
        }}
      >
        <GridView />
        {realtimeList.map((item) => {
          return (
            <Shape
              key={item.id}
              element={item}
              editorClient={editorRef.current?.getBoundingClientRect()}
              isEditState={true}
            >
              {displayComponent(item)}
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
    </>
  );
};

export default EditorModeView;
