import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { AboutMe, Github } from './components';
import PopoverMenuView from './components/PopoverMenu';
import { LayoutContentView } from './layoutContent';
import { errorConfig } from './requestErrorConfig';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // 如果是匿名用户也是可以访问，不需要原本的重定向到登录页

  console.log('getInitialState()');
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });

      console.log('queryCurrentUser', msg);
      return msg.data;
    } catch (error) {
      console.log('queryCurrentUser err', error);
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    actionsRender: () => [<AboutMe key="aboutMe" />, <Github key="github" />],
    // avatarProps: {
    //   src: initialState?.currentUser?.avatar,
    //   title: <AvatarName />,
    //   render: (_, avatarChildren) => {
    //     return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
    //   },
    // },
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    stylish: {
      header: (token) => {
        return {
          background: '#001529',
          height: '36px',

          '.ant-pro-top-nav-header-menu > *': {
            '.popover-menu-icon': {
              color: 'white',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '2px 8px',
              display: 'inline-block',
              lineHeight: '32px',
              '&:focus': { backgroundColor: token.colorPrimary },
              '&:hover': { backgroundColor: token.colorPrimary },
            },
          },
        };
      },
    },
    headerContentRender: (props) => {
      const { menuData } = props;
      if (!initialState) {
        return null;
      }

      return <PopoverMenuView menuData={menuData} />;
    },
    // menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return <LayoutContentView>{children}</LayoutContentView>;
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
