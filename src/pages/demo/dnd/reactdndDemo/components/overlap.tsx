interface OverlapProps {
  color: string;
}

const Overlap: React.FC<OverlapProps> = (props) => {
  const { color } = props;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
      }}
    />
  );
};

export default Overlap;
