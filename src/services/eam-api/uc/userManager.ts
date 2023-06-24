import request from '@/services/request';
import type { CMDReply } from '@/services/utils';
import { getUserId } from '@/services/utils';

export async function CreateUser(data: CreateUserRequest): Promise<CMDReply<CreateUserReply>> {
  return request(`/api/uc/v1/register`, {
    method: 'POST',
    data: data || {},
  });
}

export async function UpdateUser(params: UpdateUserRequest): Promise<CMDReply<UpdateUserReply>> {
  // put: "/api/uc/v1/user/{id}"
  const { id, ...data } = params;
  return request(`/api/uc/v1/user/${id}`, {
    method: 'PUT',
    data: data || {},
  });
}

export async function DeleteUser(params: DeleteUserRequest): Promise<CMDReply<DeleteUserReply>> {
  // delete: "/api/uc/v1/user/{id}"
  const { id } = params;
  return request(`/api/uc/v1/user/${id}`, {
    method: 'DELETE',
  });
}

export async function GetUser(params: GetUserRequest): Promise<CMDReply<GetUserReply>> {
  // get: "/api/uc/v1/user/{id}"
  const { id } = params;
  return request(`/api/uc/v1/user/${id}`, {
    method: 'GET',
  });
}

export async function ListUser(params?: ListUserRequest): Promise<CMDReply<ListUserReply>> {
  // get: "/api/uc/v1/users"
  return request(`/api/uc/v1/users`, {
    method: 'GET',
    params,
  });
}

// 根据id列表获取
export async function GetUsers(data: GetUsersRequest): Promise<CMDReply<GetUsersReply>> {
  // post: "/api/uc/v1/users"
  return request(`/api/uc/v1/users`, {
    method: 'POST',
    data: data || {},
  });
}

export async function currentUser() {
  const id = getUserId() || '0';
  // return request<{ data: API.CurrentUser }>('/api/uc/v1/user/' + uid, {
  //   method: 'GET',
  //   ...(options || {}),
  // });
  return GetUser({ id });
}

export interface CreateUserRequest {
  userName: string;
  nickName: string;
  email?: string;
  mobile?: string;
  password: string;
  avatar?: string;
  ext?: string;
  roles?: string[];
}

export interface CreateUserReply {
  id: string | number;
}

export interface UpdateUserRequest {
  id: string | number;
  userName?: string;
  nickName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  avatar?: string;
  status?: number;
  ext?: string;
  roles?: string[];
}

export interface UpdateUserReply {
  ok: boolean;
}

export interface DeleteUserRequest {
  id: string | number;
}

export interface DeleteUserReply {
  ok: boolean;
}

export interface GetUserRequest {
  id: string | number;
}

export interface GetUserReply {
  id: string | number;
  userName: string;
  nickName: string;
  email: string;
  mobile: string;
  avatar: string;
  status: number;
  ext: string;
  roles: RoleInfo[];
  createdAt: string;
  sex: string;
  depts: string[];
  qywxId: string;
}

export interface RoleInfo {
  role: string;
  roleName: string;
}

export interface UserItem {
  id: string | number;
  userName: string;
  nickName: string;
  email: string;
  mobile: string;
  avatar: string;
  status: number;
  ext: string;
  roles: RoleInfo[];
  createdAt: string;
  qywxId: string;
}

export interface ListUserRequest {
  pageNum?: number;
  pageSize?: number;
  account?: string;
  status?: number[];
}

export interface ListUserReply {
  result: UserItem[];
  count: number;
  current: number;
  pageSize: number;
}

export interface GetUsersRequest {
  ids: (string | number)[];
}

export interface GetUsersReply {
  result: UserItem[];
  count: number;
}
