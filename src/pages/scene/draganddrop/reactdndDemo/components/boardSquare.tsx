import { useDrop } from 'react-dnd';
import { ItemTypes } from '..';
import Knight from './knight';
import Overlap from './overlap';
import Square from './square';

interface BoardSquareProps {
  x: number;
  y: number;
  knightPosition: [number, number];
  setKnightPosition: (position: [number, number]) => void;
}

const canMoveKnight = (toX: number, toY: number, knightPosition: [number, number]) => {
  const [x, y] = knightPosition;
  const dx = toX - x;
  const dy = toY - y;

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
};

const BoardSquare: React.FC<BoardSquareProps> = (props) => {
  const { x, y, knightPosition, setKnightPosition } = props;
  const [knightX, knightY] = knightPosition;

  const isKnightHere = x === knightX && y === knightY;
  const black = (x + y) % 2 === 1;

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      drop: () => {
        setKnightPosition([x, y]);
      },
      canDrop: () => canMoveKnight(x, y, knightPosition),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [x, y, knightPosition],
  );

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Square black={black}>{isKnightHere ? <Knight /> : null}</Square>
      {isOver && !canDrop && <Overlap color={'red'} />}
      {!isOver && canDrop && <Overlap color={'yellow'} />}
      {isOver && canDrop && <Overlap color={'green'} />}
    </div>
  );
};

export default BoardSquare;
