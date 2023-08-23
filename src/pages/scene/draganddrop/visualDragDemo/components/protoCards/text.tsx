import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Input, Modal } from 'antd';
import { useRef, useState } from 'react';
import { TextCardConfig } from '../protoCard';

const { TextArea } = Input;

const TextView: React.FC<TextCardConfig> = (props) => {
  const { style } = props;

  const textRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>('双击编辑文字');
  const [contentEditMode, setContentEditMode] = useState<boolean>(false);
  // const [canEdit, setCanEdit] = useState<boolean>(false);

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
    <div
      className={className}
      style={style}
      onDoubleClick={() => {
        // setCanEdit(true);
        setContentEditMode(true);
      }}
    >
      <div
        ref={textRef}
        // contentEditable={canEdit}
        dangerouslySetInnerHTML={{ __html: text }}
        // onBlur 事件发生在对象失去焦点时
        // onBlur={() => {
        //   setText(textRef.current?.innerText || '');
        //   // setCanEdit(false);
        //   // todo 更新到model中
        // }}
      />
      <Modal
        open={contentEditMode}
        onCancel={() => setContentEditMode(false)}
        onOk={() => setContentEditMode(false)}
      >
        <TextArea
          rows={4}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </Modal>
    </div>
  );
};

export default TextView;
