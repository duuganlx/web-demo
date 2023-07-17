import { Chart } from '@antv/g2';
import { useEffect, useRef } from 'react';

const sex = [
  { city: 'A', sex: '男', value: 52 },
  { city: 'A', sex: '女', value: 48 },
  { city: 'B', sex: '男', value: 130 },
  { city: 'B', sex: '女', value: 70 },
];

function renderG2Keyframe(container: HTMLDivElement) {
  const chart = new Chart({
    container: container,
    theme: 'classic',
    autoFit: true,
  });

  const keyframe = chart.timingKeyframe();

  keyframe
    .interval()
    .data(sex)
    .transform({ type: 'groupX', y: 'sum' })
    .encode('x', 'city')
    .encode('y', 'value')
    .encode('key', 'city');

  keyframe
    .interval()
    .data(sex)
    .transform({ type: 'dodgeX' })
    .encode('x', 'city')
    .encode('y', 'value')
    .encode('color', 'sex')
    .encode('groupKey', 'city');

  chart.render();

  return chart;
}

const G2PlotTypeDemo: React.FC = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const chart = useRef<Chart | null>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    container.current.innerHTML = '';
    chart.current = renderG2Keyframe(container.current);
  }, []);

  return <div ref={container} style={{ width: '500px', height: '300px' }} />;
};

export default G2PlotTypeDemo;
