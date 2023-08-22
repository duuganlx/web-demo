import BoardSquare from './boardSquare';

interface BoardProps {
  knightPosition: [number, number];
  setKnightPosition: (position: [number, number]) => void;
}

const Board: React.FC<BoardProps> = (props) => {
  const { knightPosition, setKnightPosition } = props;

  const squares = [];
  for (let i = 0; i < 64; i++) {
    const x = i % 8;
    const y = Math.floor(i / 8);

    squares.push(
      <div key={i} style={{ width: '12.5%', height: '12.5%' }}>
        <BoardSquare
          x={x}
          y={y}
          knightPosition={knightPosition}
          setKnightPosition={setKnightPosition}
        />
      </div>,
    );
  }

  return (
    <div
      style={{
        width: '500px',
        height: '500px',
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative',
      }}
    >
      {squares}
    </div>
  );
};

export default Board;
