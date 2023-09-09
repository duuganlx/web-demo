import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './index.less';

const Welcome: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [showRocketTip, setShowRocketTip] = useState<boolean>(false);

  const className = useEmotionCss(() => {
    return {
      width: '100vw',
      height: '100vh',
      background: `url(engineer.png)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0% 85%',

      '.mask': {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      '.mask > .h2': {
        color: '#fff',
        fontSize: '32px',
      },

      '.bottom': {
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        width: '100vw',
        height: '10vh',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      },
    };
  });

  useEffect(() => {
    const titleContent = '不怕万人阻挡，只怕自己投降。';
    let index = 0;
    const renderTitle = () => {
      index++;
      setTitle(titleContent.slice(0, index));
      if (index < titleContent.length) {
        setTimeout(renderTitle, 100);
      }
    };

    renderTitle();
  }, []);

  return (
    <div className={className}>
      <div className="mask">
        <div className="h2">
          <span>{title}</span>
          <span className={style.cursor}>_</span>
        </div>
      </div>

      <Tooltip title="成功" arrow overlayInnerStyle={{ fontSize: '16px' }}>
        <div className={style.star} style={{ top: '9vh', left: '20vw' }} />
      </Tooltip>
      <Tooltip title="幸福" arrow overlayInnerStyle={{ fontSize: '16px' }}>
        <div className={style.star} style={{ top: '17vh', left: '57vw' }} />
      </Tooltip>

      <div
        className="bottom"
        onClick={() => {
          message.info('开发中，敬请期待...');
        }}
        onMouseEnter={() => {
          setShowRocketTip(true);
        }}
        onMouseLeave={() => {
          setShowRocketTip(false);
        }}
      >
        <div className={style.enter}>
          <div
            style={{
              fontSize: '16px',
              display: showRocketTip ? '' : 'none',
              marginBottom: '10px',
              color: 'white',
            }}
          >
            首页
          </div>
          <div style={{ transform: 'rotate(-45deg)', fontSize: '24px' }}>&#x1F680;</div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
