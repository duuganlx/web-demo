﻿/**
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
    path: '/welcome',
    redirect: '/',
  },
  {
    path: '/',
    name: 'welcome',
    component: './welcome',
  },
  {
    path: '/home',
    name: 'home',
    component: './home',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/eam',
    name: 'EAM',
    icon: 'DeploymentUnitOutlined',
    hideInBreadcrumb: true,
    routes: [
      {
        name: '数据资讯',
        path: '/eam/datainfo',
        hideInBreadcrumb: true,
        routes: [
          {
            path: 'eam/datainfo/infowatch',
            name: '实时资讯',
            component: './eam/datainfo/infoWatch',
          },
          {
            path: '/eam/datainfo/datamarket',
            name: '数据集市',
            component: './eam/datainfo/dataMarket',
          },
          {
            path: '/eam/datainfo/cardmarket',
            name: '卡片集市',
            component: './eam/datainfo/cardMarket',
            hideInBreadcrumb: true,
          },
        ],
      },
      {
        name: '运营管理',
        path: '/eam/operation',
        routes: [
          {
            path: '/eam/operation/settlementDetails',
            name: '结算明细报表',
            component: './eam/operation/settlementDetails',
          },
        ],
      },
      {
        name: '量化投研',
        path: '/eam/investmentquant',
        routes: [
          {
            path: '/eam/investmentquant/analystCoverage',
            name: '分析师行业覆盖',
            component: './eam/investmentquant/analystCoverage',
          },
        ],
      },
    ],
  },
  {
    path: '/scene',
    name: '场景样例',
    icon: 'StarOutlined',
    routes: [
      {
        name: '绘图',
        path: '/scene/operstldetail',
        component: './scene/OperStlDetail',
        hideInBreadcrumb: true,
      },
      {
        name: '数据集市',
        path: '/scene/datamarket',
        component: './scene/DataMarket',
        hideInBreadcrumb: true,
      },
      {
        name: '拖拽',
        path: '/scene/draganddrop',
        hideInBreadcrumb: true,
        routes: [
          {
            path: '/scene/draganddrop/reactdnd',
            name: 'react DnD',
            component: './scene/draganddrop/reactdndDemo',
          },
          {
            path: '/scene/draganddrop/visualdrag',
            name: 'visual drag demo',
            component: './scene/draganddrop/visualDragDemo',
          },
          {
            path: '/scene/draganddrop/appeditorreactdndts',
            name: 'app editor react dnd ts',
            component: './scene/draganddrop/appEditorReactDndDemo',
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        component: './Admin',
      },
    ],
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
