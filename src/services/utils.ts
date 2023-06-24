import { v4 as uuid } from 'uuid';
import type { UserItem } from './eam-api/uc/userManager';

declare type UserInfo = UserItem;

const avatarColors = [
  '#5F9EA0',
  '#FF7F50',
  '#DC143C',
  '#A52A2A',
  '#DEB887',
  '#5F9EA0',
  '#00008B',
  '#008B8B',
  '#B8860B',
  '#006400',
  '#8B008B',
  '#FF8C00',
  '#483D8B',
  '#2F4F4F',
  '#FF1493',
  '#1E90FF',
  '#B22222',
  '#228B22',
  '#CD5C5C',
  '#4B0082',
  '#778899',
  '#0000CD',
  '#000080',
  '#800080',
  '#FF0000',
  '#4169E1',
  '#8B4513',
  '#FA8072',
  '#F4A460',
  '#2E8B57',
  '#A0522D',
  '#6A5ACD',
  '#4682B4',
  '#008080',
  '#FF6347',
  '#434E54',
];

export interface CMDReplyV2<DataType> {
  code: number;
  msg: string;
  data: DataType;
  reason: string;
}

export interface CMDReply<DataType> {
  code: number;
  msg: string;
  data: DataType;
}

export const setUserInfoByStr = (userinfo: string) => {
  return localStorage.setItem('userinfo', userinfo);
};

export const getUserInfo = () => {
  const userInfoStr = localStorage.getItem('userinfo');
  return JSON.parse(`${userInfoStr || '{}'}`) as UserInfo;
};

export const getUserName = () => {
  return localStorage.getItem('user_name');
};

export const setUserName = (user: UserInfo) => {
  return localStorage.setItem('user_name', `${user.nickName} (${user.userName})`);
};

export const clearUserInfo = () => {
  localStorage.removeItem('userinfo');
  localStorage.removeItem('user_name');
};

export const getGlobalData = (key: string) => {
  return localStorage.getItem(key);
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const setAccessToken = (access_token: string) => {
  return localStorage.setItem('access_token', access_token || '');
};
export const clearAccessToken = () => {
  localStorage.removeItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const setRefreshToken = (refresh_token: string) => {
  return localStorage.setItem('refresh_token', refresh_token);
};

export const clearRefreshToken = () => {
  localStorage.removeItem('refresh_token');
};

export const getUserId = () => {
  return localStorage.getItem('user_id');
};

export const setUserId = (user_id: string) => {
  return localStorage.setItem('user_id', user_id || '');
};
export const clearUserId = () => {
  localStorage.removeItem('user_id');
};

export const clearInfo = () => {
  clearAccessToken();
  clearRefreshToken();
  clearUserInfo();
  clearUserId();
};
type MenuDataItem = {
  /** @name 子菜单 */
  children?: MenuDataItem[];
  /** @name 在菜单中隐藏子节点 */
  hideChildrenInMenu?: boolean;
  /** @name 在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean;
  /** @name 菜单的icon */
  icon?: React.ReactNode;
  /** @name 自定义菜单的国际化 key */
  locale?: string | false;
  /** @name 菜单的名字 */
  name?: string;
  /** @name 用于标定选中的值，默认是 path */
  key?: string;
  /** @name disable 菜单选项 */
  disabled?: boolean;
  /** @name 路径,可以设定为网页链接 */
  path?: string;
  /**
   * 当此节点被选中的时候也会选中 parentKeys 的节点
   *
   * @name 自定义父节点
   */
  parentKeys?: string[];
  /** @name 隐藏自己，并且将子节点提升到与自己平级 */
  flatMenu?: boolean;
  /** @name 指定外链打开形式，同a标签 */
  target?: string;
  [key: string]: any;
};
let localRouters: MenuDataItem[];

export function setConfigRoutes(rs: MenuDataItem[]) {
  localRouters = rs;
}

export function getConfigRoutes() {
  return localRouters;
}

export const getUuidShort = (len: number = 8) => {
  return uuid().substring(0, len);
};

export function stringToHex(str: string) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(10);
  }
  return Number(result);
}

export function transferStrToColorHex(str: string) {
  const val = stringToHex(str) % avatarColors.length;

  return avatarColors[val];
}

export function transferCountToUnit(limit: number) {
  let size = '';
  if (limit < 10000) {
    //小于 10000
    size = `${limit}`;
  } else if (limit < 10000 * 10000) {
    //小于 1e
    size = (limit / 10000).toFixed(1) + '万';
  } else {
    //其他转化成GB
    size = (limit / (10000 * 10000)).toFixed(1) + '亿';
  }

  return size;
}

export function transferBytesToUnit(limit: number) {
  let size = '';
  if (limit < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    size = limit.toFixed(1) + 'B';
  } else if (limit < 0.1 * 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(1) + 'KB';
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(1) + 'MB';
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
  }

  const sizeStr = size + ''; //转成字符串
  const index = sizeStr.indexOf('.'); //获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
  if (dou === '00') {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
}
