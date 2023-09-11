import { useModel } from '@umijs/max';
import { useRef } from 'react';
import Shape from './Shape';
import { displayComponent } from './protoCard';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ShowModeViewProps {}

const ShowModeView: React.FC<ShowModeViewProps> = (props) => {
  console.log(props);

  const { realtimeList } = useModel('demo.dnd.visualDragDemo.model', (model) => ({
    realtimeList: model.realtimeList,
  }));

  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div style={{ width: '95vw', height: '80vh', backgroundColor: '#fff' }}>
        {realtimeList.map((item) => {
          return (
            <Shape
              key={item.id}
              element={item}
              editorClient={editorRef.current?.getBoundingClientRect()}
              isEditState={false}
            >
              {displayComponent(item)}
            </Shape>
          );
        })}
      </div>
    </>
  );
};

export default ShowModeView;
