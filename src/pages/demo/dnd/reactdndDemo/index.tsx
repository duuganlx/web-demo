import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from './components/board';

export const ItemTypes = {
  KNIGHT: 'knight',
};

const ReactDndDemo: React.FC = () => {
  const [knightPosition, setKnightPosition] = useState<[number, number]>([0, 0]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Board knightPosition={knightPosition} setKnightPosition={setKnightPosition} />
    </DndProvider>
  );
};

export default ReactDndDemo;
