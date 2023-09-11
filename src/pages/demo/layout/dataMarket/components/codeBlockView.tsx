import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Button, message } from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// 代码标亮
export interface CodeBlockViewProps {
  content: string;
  lang: string;
  showLineNumbers?: boolean;
}

const CodeBlockView: React.FC<CodeBlockViewProps> = (props) => {
  const { content, lang, showLineNumbers } = props;

  const className = useEmotionCss(() => {
    return {
      padding: '10px',
      backgroundColor: '#fff',
      position: 'relative',

      '&:hover': {
        button: {
          display: 'block',
        },
      },

      button: {
        position: 'absolute',
        top: '8px',
        left: 'calc(100vw - 150px)',
        backgroundColor: '#bfbfbf',
        display: 'none',
      },
    };
  });

  return (
    <div className={className}>
      <SyntaxHighlighter
        language={lang}
        showLineNumbers={showLineNumbers ?? false}
        wrapLines
        style={atomOneLight}
      >
        {content}
      </SyntaxHighlighter>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          if (copy(content)) {
            message.success('复制成功');
          } else {
            message.error('复制失败');
          }
        }}
      >
        copy
      </Button>
    </div>
  );
};

export default CodeBlockView;
