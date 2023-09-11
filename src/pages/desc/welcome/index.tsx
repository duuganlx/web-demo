import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history } from '@umijs/max';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import style from './index.less';

const Welcome: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [showRocketTip, setShowRocketTip] = useState<boolean>(false);

  const className = useEmotionCss(() => {
    return {
      width: '100vw',
      height: 'calc(100vh - 36px)',
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
        bottom: '1vh',
        display: 'flex',
        width: '100vw',
        height: '10vh',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      },

      '.star': {
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: '#ffe58f',
        border: '1px solid #ffe58f',
        borderRadius: '8px',
        cursor: 'pointer',
      },

      '.enter': {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'default',

        '.rocket': {
          transform: 'rotate(-45deg)',
          fontSize: '24px',
        },

        '.rocket-label': {
          fontSize: '16px',
          visibility: showRocketTip ? 'visible' : 'hidden',
          color: 'white',
        },
      },
    };
  });

  useEffect(() => {
    const titleContent = '我想去那发光的星球上看看🤔...';
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
        <div className={classNames(style.star, 'star')} style={{ top: '9vh', left: '20vw' }} />
      </Tooltip>
      <Tooltip title="幸福" arrow overlayInnerStyle={{ fontSize: '16px' }}>
        <div className={classNames(style.star, 'star')} style={{ top: '17vh', left: '57vw' }} />
      </Tooltip>

      <div
        className="bottom"
        onClick={() => {
          const homePath = '/home';
          history.push(homePath);
        }}
        onMouseEnter={() => {
          setShowRocketTip(true);
        }}
        onMouseLeave={() => {
          setShowRocketTip(false);
        }}
      >
        <div className={classNames(style.enter, 'enter')}>
          <div className="rocket">&#x1F680;</div>
          <div className="rocket-label">首页</div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
