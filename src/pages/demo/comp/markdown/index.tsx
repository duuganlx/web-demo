import { message } from 'antd';
import { Octokit } from 'octokit';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownView: React.FC = () => {
  const octokit = new Octokit({});

  const [content, setContent] = useState<string>('');

  octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'duuganlx',
      repo: 'datahub',
      path: 'tmd.md',
    })
    .then((res) => {
      if (res.status !== 200) {
        message.info('获取数据失败');
        return;
      }

      const base64_str = (res.data as { content: string | undefined }).content || '';
      const decoded_content = Buffer.from(base64_str, 'base64').toString();
      setContent(decoded_content);
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownView;
