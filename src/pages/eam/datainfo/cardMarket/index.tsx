import { PageContainer, nanoid } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';
import Grid from './components/Grid';
import Shape from './components/Shape';
import DragComList, { DRAG_COM_LIST } from './components/dragComList';
import TextView from './template/Text';

const CardMarketView: React.FC = () => {
  const { realtimeList, setRealtimeList } = useModel('eam.datainfo.cardMarket.model', (model) => ({
    realtimeList: model.realtimeList,
    setRealtimeList: model.upRealtimeList,
  }));

  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditState, setIsEditState] = useState<boolean>(false);

  return (
    <PageContainer
      fixedHeader={false}
      subTitle={
        <>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setIsEditState(!isEditState);
            }}
          >
            {isEditState ? '保存' : '编辑'}
          </Button>
        </>
      }
    >
      {/* 工作区 */}
      {isEditState ? (
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
          <Grid />
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
      ) : (
        <div style={{ width: '100%', height: '60vh', backgroundColor: '#fff' }}>
          {realtimeList.map((item, index) => {
            return (
              <Shape
                key={item.id}
                element={item}
                style={{ ...item.style, zIndex: realtimeList.length - index }}
                editorClient={editorRef.current?.getBoundingClientRect()}
                isEditState={false}
              >
                <TextView key={item.id} style={{ ...item.style }} />
              </Shape>
            );
          })}
        </div>
      )}

      {/* 工具栏 */}
      {isEditState ? (
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
      ) : null}
    </PageContainer>
  );
};

export default CardMarketView;
