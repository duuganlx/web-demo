/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/',
    name: '初识网站',
    icon: 'CrownOutlined',
    routes: [
      {
        name: '网站说明',
        path: '/',
        routes: [
          {
            path: '/welcome',
            redirect: '/',
          },
          {
            path: '/',
            name: '欢迎页',
            component: './desc/welcome',
          },
          {
            path: '/home',
            name: '首页',
            component: './desc/home',
          },
          {
            name: '个人介绍',
            path: '/me',
            component: './desc/me',
          },
        ],
      },
    ],
  },
  {
    path: '/demo',
    name: '可行实验',
    icon: 'ExperimentOutlined',
    hideInBreadcrumb: true,
    routes: [
      {
        name: '组件',
        path: '/demo/comp',
        routes: [
          {
            path: '/demo/comp/drawing',
            name: '绘图',
            component: './demo/comp/drawing',
            hideInBreadcrumb: true,
          },
          {
            path: '/demo/comp/markdown',
            name: 'markdown',
            component: './demo/comp/markdown',
            hideInBreadcrumb: true,
          },
        ],
      },
      {
        name: '布局',
        path: '/demo/layout',
        hideInBreadcrumb: true,
        routes: [
          {
            path: '/demo/layout/dataMarket',
            name: '数据集市',
            component: './demo/layout/dataMarket',
            hideInBreadcrumb: true,
          },
        ],
      },
      {
        name: '表格',
        path: '/demo/table',
        hideInBreadcrumb: true,
        routes: [
          {
            path: '/demo/table/antd',
            name: 'antd',
            component: './demo/table/antdT',
          },
          {
            path: '/demo/table/s2table',
            name: 's2table',
            component: './demo/table/s2table',
          },
        ],
      },
      {
        name: '拖拽',
        path: '/demo/dnd',
        hideInBreadcrumb: true,
        routes: [
          {
            path: '/demo/dnd/reactdnd',
            name: 'react DnD',
            component: './demo/dnd/reactdndDemo',
          },
          {
            path: '/demo/dnd/visualdrag',
            name: 'visual drag demo',
            component: './demo/dnd/visualDragDemo',
          },
          {
            path: '/demo/dnd/appeditorreactdndts',
            name: 'app editor react dnd ts',
            component: './demo/dnd/appEditorReactDndDemo',
          },
        ],
      },
    ],
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
