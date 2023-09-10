import { AppstoreOutlined } from '@ant-design/icons';
import { MenuDataItem } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Link } from '@umijs/max';
import { Divider, Popover } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import style from './index.less';

export type PopoverMenuViewProps = {
  user?: number; // 登陆的用户信息
  menuData?: MenuDataItem[]; // 本地配置的路由信息
};

// 应用子项
// interface AppTypeItem {
//   id: number;
//   name: string;
//   path: string;
//   icon?: string | React.ReactNode;
//   // typeName?: string; // 应用类型名称
//   visible?: boolean; // 是否显示
//   parent?: number; // 父级id
//   children?: (AppTypeItem | MenuDataItem)[]; // 正常此处children 应支持3-4个类型的数组， 如
//   remark?: string;
// }

// const defaultApplist: AppTypeItem[] = [
//   {
//     id: -1,
//     name: '我的应用',
//     path: 'extra',
//     icon: <ShareAltOutlined />,
//     visible: true,
//     children: [
//       {
//         id: -3,
//         name: '编码开发',
//         path: 'extra1',
//         parent: -1,
//         children: [
//           {
//             id: -5,
//             name: 'github',
//             path: 'https://github.com/duganlxx',
//             parent: -3,
//           },
//         ],
//       },
//       {
//         id: -2,
//         name: '技术文档',
//         path: 'extra2',
//         parent: -1,
//         children: [
//           {
//             id: -4,
//             name: 'antd',
//             path: 'https://ant.design/index-cn',
//             parent: -2,
//           },
//           {
//             id: -6,
//             name: 'umijs',
//             path: 'https://umijs.org/',
//             parent: -2,
//           },
//         ],
//       },
//     ],
//   },
// ];

const PopoverMenuView: React.FC<PopoverMenuViewProps> = (props) => {
  const { menuData } = props;

  const validRouters = [...(menuData || [])];
  const validMap: Record<string, any> = {};
  validRouters.forEach((item) => {
    validMap[item.name!] = item;
  });

  const [activeTopMenu, setActiveTopMenu] = useState<string>(validRouters[0].name!);
  const [open, setOpen] = useState<boolean>(false);

  const menuContentClass = useEmotionCss(({ token }) => {
    return {
      backgroundColor: token.colorBgElevated,
      // 菜单栏左侧一级菜单栏 css样式效果
      '.block-left': {
        'ul > li ': {
          '.active, &:hover, &:active': {
            background: token.colorBgTextActive,
            '.title': {
              color: token.colorPrimaryActive,
            },
          },
          // 左侧菜单栏底部动画效果背景色
          '.title .menu-border': {
            borderBottomColor: token.colorPrimaryActive,
          },
        },
      },

      // 菜单栏右侧二级菜单栏以及三级菜单栏 css样式效果
      '.block-right': {
        '.second-menu-container .second-menu-item': {
          '.second-menu-title': {
            color: token.colorPrimary,
          },

          '.second-menu-subMenu > a': {
            color: token.colorTextSecondary,
            '&:hover': {
              fontWeight: 'bold',
              color: token.colorPrimaryActive,
            },
          },
        },
      },
    };
  });

  const renderIcon = (icon?: string | React.ReactNode) => {
    if (!icon) {
      return null;
    }

    if (typeof icon === 'string') {
      return <img src={icon} alt="" />;
    }
    return icon;
  };

  function renderRight(vMap: Record<string, MenuDataItem>, atMenu: string) {
    const routers = vMap[atMenu]?.children || [vMap[atMenu]];
    return (
      <div className="second-menu-wrap">
        <div className="second-menu-container">
          {routers.map((item) => {
            if (item.hideInMenu || !item.name || !item.path) return null;
            return (
              <div key={item.path} className="second-menu-item">
                {/* 二级菜单头 */}
                <div className="second-menu-title">{item.name}</div>
                {/* 二级菜单子项 */}
                {(item.children || [item]).map((subItem) => {
                  if (subItem.hideInMenu || !subItem.name || !subItem.path) return null;
                  return (
                    <div key={subItem.path} className="second-menu-subMenu">
                      {subItem.path.startsWith('http') ? (
                        <a href={subItem.path} target="_blank" rel="noreferrer">
                          {subItem.name}
                        </a>
                      ) : (
                        <Link
                          to={subItem.path}
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          {subItem.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* <div className="second-menu-right">
            <div className="second-menu-right-wrap">
              <div className="second-menu-right-item-title">热门推荐</div>
              <div className="second-menu-right-item-content" />
            </div>
          </div> */}
      </div>
    );
  }

  const renderContent = () => {
    return (
      <div className={classNames(style.popoverMenu, menuContentClass)}>
        <div className="block-left">
          {validRouters.map((item) => {
            return (
              <ul
                key={item.name}
                onMouseEnter={() => {
                  setActiveTopMenu(item.name!);
                }}
              >
                <li className={item.name === activeTopMenu ? 'active' : ''}>
                  <div className={'title'}>
                    {renderIcon(item.icon)}
                    {item.name}
                    <div className="menu-border" />
                  </div>
                </li>
              </ul>
            );
          })}
        </div>
        <div className="block-right">{renderRight(validMap, activeTopMenu)}</div>
      </div>
    );
  };

  return (
    <div>
      <Divider style={{ height: '1.5em', backgroundColor: '#fff' }} type="vertical" />
      <Popover
        placement="bottom"
        overlayStyle={{
          width: 'calc(100vw - 24px)',
          padding: '4px',
          top: '32px',
        }}
        arrow={false}
        content={renderContent()}
        open={open}
        onOpenChange={(openIn) => {
          setOpen(openIn);
        }}
      >
        <span className={'popover-menu-icon'}>
          <AppstoreOutlined style={{ marginRight: '4px' }} />
          菜单
        </span>
      </Popover>
    </div>
  );
};

export default PopoverMenuView;
