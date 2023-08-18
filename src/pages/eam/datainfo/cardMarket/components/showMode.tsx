import { useModel } from '@umijs/max';
import { useRef } from 'react';
import TextView from '../template/Text';
import Shape from './Shape';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ShowModeViewProps {}

const ShowModeView: React.FC<ShowModeViewProps> = (props) => {
  console.log(props);

  const { realtimeList } = useModel('eam.datainfo.cardMarket.model', (model) => ({
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
