import Knight from './knight';
import Square from './square';

interface BoardProps {
  knightPosition: [number, number];
}

function renderSquare(i: number, [knightX, knightY]: [number, number]) {
  const x = i % 8;
  const y = Math.floor(i / 8);
  const isKnightHere = x === knightX && y === knightY;
  const black = (x + y) % 2 === 1;
  const piece = isKnightHere ? <Knight /> : null;

  return (
    <div key={i} style={{ width: '12.5%', height: '12.5%' }}>
      <Square black={black}>{piece}</Square>
    </div>
  );
}

const Board: React.FC<BoardProps> = (props) => {
  const { knightPosition } = props;

  const squares = [];
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, knightPosition));
  }

  return (
    <div
      style={{
        width: '500px',
        height: '500px',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {squares}
    </div>
  );
};

export default Board;
