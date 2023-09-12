import { message } from 'antd';
import { Octokit } from 'octokit';

const AntdT: React.FC = () => {
  const octokit = new Octokit({});

  octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'duuganlx',
      repo: 'datahub',
      path: 'test.csv',
    })
    .then((res) => {
      if (res.status !== 200) {
        message.info('获取数据失败');
        return;
      }

      const base64_str = (res.data as { content: string | undefined }).content || '';
      const decoded_content = Buffer.from(base64_str, 'base64').toString();
      console.log(decoded_content);
    })
    .catch((err) => {
      console.log(err);
    });

  octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'duuganlx',
      repo: 'datahub',
      path: 'tjson.json',
    })
    .then((res) => {
      if (res.status !== 200) {
        message.info('获取数据失败');
        return;
      }

      const base64_str = (res.data as { content: string | undefined }).content || '';
      const decoded_content = Buffer.from(base64_str, 'base64').toString();
      console.log(decoded_content);
    })
    .catch((err) => {
      console.log(err);
    });

  return <>AntdT</>;
};

export default AntdT;
