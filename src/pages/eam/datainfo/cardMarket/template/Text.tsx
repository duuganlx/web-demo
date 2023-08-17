import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useRef, useState } from 'react';

interface TextProps {
  style?: any;
  name?: string;
}
const TextView: React.FC<TextProps> = (props) => {
  const { style, name } = props;

  const textRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>('双击编辑文字');
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const className = useEmotionCss(() => {
    return {
      height: '24px',
      lineHeight: '24px',
      boxShadow: '0px 0px 6px 0px rgba(95, 109, 128, 0.16)',
      backgroundColor: '#fff',
      borderRadius: '3px',
      overflow: 'hidden',
      padding: '5px 6px',
    };
  });

  return (
    <div className={className} style={style} title={name}>
      <div
        ref={textRef}
        contentEditable={canEdit}
        dangerouslySetInnerHTML={{ __html: text }}
        onDoubleClick={() => {
          setCanEdit(true);
        }}
        onBlur={() => {
          setText(textRef.current?.innerText || '');
          setCanEdit(false);
          // todo 更新到model中
        }}
      />
    </div>
  );
};

export default TextView;
