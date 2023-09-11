import { useEmotionCss } from '@ant-design/use-emotion-css';
import { PROTO_CARD_LIST } from './protoCard';

const DragComList: React.FC = () => {
  const className = useEmotionCss(() => {
    return {
      height: '100%',
      width: '100%',
      display: 'flex',

      '.list': {
        width: '80px',
        height: '40px',
        border: '1px solid #ddd',
        cursor: 'grab',
        textAlign: 'center',
        color: '#333',
        padding: '2px 5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        '&:hover': {
          cursor: 'grabbing',
        },
      },
    };
  });

  const handleDragStart = (e: any) => {
    e.dataTransfer.setData('comType', e.target.dataset.type);
  };

  return (
    <div className={className} onDragStart={handleDragStart}>
      {PROTO_CARD_LIST.map((item, index) => (
        <div key={index} className="list" draggable data-index={index} data-type={item.type}>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DragComList;
