import { useModel } from '@umijs/max';
import { useRef } from 'react';
import Shape from './Shape';
import TextView from './protoCards/text';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ShowModeViewProps {}

const ShowModeView: React.FC<ShowModeViewProps> = (props) => {
  console.log(props);

  const { realtimeList } = useModel('scene.draganddrop.visualDragDemo.model', (model) => ({
    realtimeList: model.realtimeList,
  }));

  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <>
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
    </>
  );
};

export default ShowModeView;
