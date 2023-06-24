import { GetSql } from '@/services/eam-api/datacenter/datahub';
import { transform2Objects } from '@/services/eam-api/datamarket/transfer_data';
import { message } from 'antd';

export type SettleOption = {
  dbName: string;
  tableName: string;
};

export type SettleUnitItem = {
  category: 'unit' | 'account' | 'product';
  type: string;
  name: string;
  fullName: string;
  code: string;
  remark?: string;
};

export interface StlUnitItem extends SettleUnitItem {
  category: 'unit';
}

export interface StlAccountItem extends SettleUnitItem {
  category: 'account';
  units: Record<string, StlUnitItem>;
}

export interface StlProductItem extends SettleUnitItem {
  category: 'product';
  accounts: Record<string, StlAccountItem>;
}

export function transformStlProductItem(datas: Record<string, any[]>): StlProductItem[] {
  const result: StlProductItem[] = [];

  if (!datas || Object.keys(datas).length === 0) return result;

  const cache: Record<string, StlProductItem> = {};

  for (let i = 0; i < datas.product_inner_code.length; i++) {
    const product_inner_code = datas.product_inner_code[i];
    const product_full_name = datas.product_full_name[i];
    if (product_inner_code.length === 0 || product_full_name.length === 0) continue; // TODO 产品内码为空的数据，需要过滤掉，未来补充

    const unitItem: StlUnitItem = {
      category: 'unit',
      type: datas.unit_type[i],
      code: datas.unit_code[i],
      name: datas.unit_name[i],
      fullName: datas.unit_name[i],
    };

    const accountItem: StlAccountItem = {
      category: 'account',
      type: datas.account_type[i],
      code: datas.account_code[i],
      name: datas.account_name[i],
      fullName: datas.account_name[i],
      units: {},
    };
    accountItem.units[unitItem.code] = unitItem;

    if (!cache[product_inner_code]) {
      const prdItem: StlProductItem = {
        category: 'product',
        type: datas.product_type[i],
        code: product_inner_code,
        name: datas.product_short_name[i],
        fullName: product_full_name,
        remark: datas.fund_record_number[i],
        accounts: {},
      };
      prdItem.accounts[accountItem.code] = accountItem;

      cache[product_inner_code] = prdItem;
    } else {
      if (!cache[product_inner_code].accounts[accountItem.code]) {
        cache[product_inner_code].accounts[accountItem.code] = accountItem;
      } else {
        cache[product_inner_code].accounts[accountItem.code].units[unitItem.code] = unitItem;
      }
    }
  }

  Object.values(cache).forEach((item) => {
    result.push(item);
  });
  console.log(result);
  return result;
}

export async function ListStlProducts() {
  const result: StlProductItem[] = [];
  const sql = `
    select *
    from dim_datahub.dim_unit_account_product 
    where 1=1 
    ORDER BY product_inner_code
  `;

  const cmd = await GetSql({
    sql: sql,
    dbName: 'dim_datahub',
    tableName: 'dim_unit_account_product',
  });

  if (!cmd) {
    await message.error('网络错误，请联系管理员');
    return result;
  }

  if (cmd.code !== 0) {
    await message.error('获取产品账户数据失败' + cmd.msg);
    return result;
  }
  console.log('ListStlProducts:', cmd.data.datas);
  return transformStlProductItem(cmd.data.datas);
}

export async function FilterStlProducts(keyword: string) {
  const result: StlProductItem[] = [];
  const sql = `
    select *
    from dim_datahub.dim_unit_account_product 
    where 1=1 
    and (
      product_short_name like '%${keyword}%' 
      or product_full_name like '%${keyword}%'
      or fund_record_number like '%${keyword}%'
      or account_code like '%${keyword}%'
      or account_name like '%${keyword}%'
      or unit_code like '%${keyword}%'
      or unit_name like '%${keyword}%'
    )
    ORDER BY product_inner_code
  `;

  const cmd = await GetSql({
    sql: sql,
    dbName: 'dim_datahub',
    tableName: 'dim_unit_account_product',
  });

  if (!cmd) {
    message.error('网络错误，请联系管理员');
    return result;
  }

  if (cmd.code !== 0) {
    message.error('获取产品账户数据失败' + cmd.msg);
    return result;
  }
  console.log(cmd);
  return result;
}

export interface StlBalanceItem {
  auCode: string; //	资金账号
  auName: string; //	资金账号名称
  tradeDate: number | string; //	交易日
  currency: string; //	币种
  totalAsset: number; //	总资产
  equity: number; //	持仓市值
  equityInTransit: number; //	在途市值
  fundInitial: number; //	交易日开始时的可用资金
  fundAvailable: number; //	可用资金
  fundInTransit: number; //	在途资金
  fundFrozen: number; //	冻结资金
  balance: number; //	资金余额
  commission: number; //	手续费
  createTime: number | string; //	成交时间
  updateTime: number | string; //	更新时间
  settleTime: number | string; //	清算时间
}

/**
 * 列表查询资金账户信息
 * @param keyword 关键字
 * @param auCode 资金账号
 * @param begin 开始时间
 * @param end 结束时间
 * @param tradeDate 交易日 与begin end互斥
 * @param where 附加自定义查询条件
 */
export interface ListStlBalancesRequest {
  keyword?: string;
  auCode?: string[];
  begin?: number; // 时间戳
  end?: number; // 时间戳
  tradeDate?: number; // 时间戳  与begin end互斥
  where?: string;
}

async function ListBalances(
  data?: ListStlBalancesRequest,
  opt?: SettleOption,
): Promise<StlBalanceItem[]> {
  const { dbName, tableName } = opt || { dbName: 'ads_eqw', tableName: 'ads_account_balance' };
  const wheres = ['1=1'];
  if (data?.keyword) {
    wheres.push(`(au_name like '%${data.keyword}%' or au_code like '%${data.keyword}%')`);
  }
  if (data?.auCode) {
    wheres.push(`au_code in ('${data.auCode.map((item) => `${item}`).join("','")}')`);
  }
  if (data?.tradeDate) {
    wheres.push(`trade_date = ${data.tradeDate * 1000}`);
  } else {
    if (data?.begin) {
      wheres.push(`trade_date >= ${data.begin * 1000}`);
    }
    if (data?.end) {
      wheres.push(`trade_date <= ${data.end * 1000}`);
    }
  }

  if (data?.where) {
    wheres.push(data.where);
  }

  const where = wheres.join(' and ');
  const sql = `select * from ${dbName}.${tableName} where ${where} ORDER BY trade_date, au_code `;

  return GetSql({
    sql: sql,
    dbName: dbName,
    tableName: tableName,
  }).then((cmd) => {
    if (!cmd) {
      throw new Error('网络错误，请联系管理员');
    }

    if (cmd.code !== 0) {
      throw new Error('获取账户数据失败,err: ' + cmd.msg);
    }

    return transform2Objects<StlBalanceItem>(cmd.data.datas);
  });
}

export interface StlPositionItem {
  auCode: string; // 资产单元
  tradeDate: number; // 交易日
  symbol: string; // 证券代码
  secCnName: string; // 证券名称
  side: number; // 买卖方向
  availableVolume: number; // 可用数
  totalVolume: number; // 拥股数总量
  todayOpen: number; // 今日买入数量
  preVolume: number; // 昨日拥股数
  frozenVolume: number; // 卖冻结
  marketValue: number; // 市值
  mtm: number; // 盯市价格
  isSettled: 0 | 1; // 是否已结算0: 未结算;   1-已结算
  createTime: number; // 创建时间
  updateTime: number; // 更新时间
}

export interface ListStlPositionsRequest {
  keyword?: string;
  auCode?: string[];
  symbol?: string[]; // 证券代码
  begin?: number; // 时间戳
  end?: number; // 时间戳
  isSettled?: 0 | 1; // 是否已结算0: 未结算;   1-已结算
  side?: number; // 买卖方向
  tradeDate?: number; // 交易日 时间戳  与begin end互斥
  available?: boolean; // 可用数
  where?: string; // 自定义where
}

async function ListPositions(
  data?: ListStlPositionsRequest,
  opt?: SettleOption,
): Promise<StlPositionItem[]> {
  const { dbName, tableName } = opt || { dbName: 'ads_eqw', tableName: 'ads_account_positions' };

  const wheres = ['1=1'];
  if (data?.keyword) {
    wheres.push(
      `(sec_cn_name like '%${data.keyword}%' or symbol like '%${data.keyword}%' or au_code like '%${data.keyword}%')`,
    );
  }
  if (data?.auCode) {
    wheres.push(`au_code in ('${data.auCode.map((item) => `${item}`).join("','")}')`);
  }
  if (data?.symbol) {
    wheres.push(`symbol in ('${data.symbol.map((item) => `${item}`).join("','")}')`);
  }
  if (data?.isSettled !== undefined) {
    wheres.push(`is_settled = ${data.isSettled}`);
  }
  if (data?.side) {
    wheres.push(`side = ${data.side}`);
  }

  if (data?.tradeDate) {
    wheres.push(`trade_date = ${data.tradeDate * 1000}`);
  } else {
    if (data?.begin) {
      wheres.push(`trade_date >= ${data.begin * 1000}`);
    }
    if (data?.end) {
      wheres.push(`trade_date <= ${data.end * 1000}`);
    }
  }
  if (data?.where) {
    wheres.push(data.where);
  }
  if (data?.available) {
    wheres.push(`available_volume > 0`);
  }

  const where = wheres.join(' and ');
  const sql = `select * from ${dbName}.${tableName} where ${where} ORDER BY trade_date, au_code, symbol `;

  return GetSql({
    sql: sql,
    dbName: dbName,
    tableName: tableName,
  }).then((cmd) => {
    if (!cmd) {
      throw new Error('网络错误，请联系管理员');
    }

    if (cmd.code !== 0) {
      throw new Error('获取账户持仓失败, err: ' + cmd.msg);
    }

    return transform2Objects<StlPositionItem>(cmd.data.datas);
  });
}

// todo 产品级 等待 券商数据入库
export async function ListStlBalances(
  params: ListStlBalancesRequest & {
    category: 'account' | 'product' | 'unit' | 'checking';
  },
) {
  const optionMap: Record<string, SettleOption> = {
    account: { dbName: 'ads_eqw', tableName: 'ads_account_balances' },
    product: { dbName: 'ads_eqw', tableName: 'ads_account_balances' },
    unit: { dbName: 'ads_eqw', tableName: 'ads_unit_balance' },
    checking: { dbName: 'ads_eqw', tableName: 'ads_account_balances_checking' },
  };
  const { category, ...other } = params;

  return ListBalances(other, optionMap[category]);
}

export async function ListStlPositions(
  params: ListStlPositionsRequest & {
    category: 'account' | 'product' | 'unit' | 'checking';
  },
) {
  const optionMap: Record<string, SettleOption> = {
    account: { dbName: 'ads_eqw', tableName: 'ads_account_position' },
    product: { dbName: 'ads_eqw', tableName: 'ads_account_position' },
    unit: { dbName: 'ads_eqw', tableName: 'ads_unit_position' },
    checking: { dbName: 'ads_eqw', tableName: 'ads_account_position_checking' },
  };
  const { category, ...other } = params;
  return ListPositions(other, optionMap[category]);
}

/**
 * 获取最新资产的请求体
 * @param auCode string[] 账户代码
 * @param tradeDate number 交易日
 * @param where string 自定义where
 */
export interface GetStlBalanceRequest {
  auCode?: string[];
  tradeDate: number | 'latest';
  where?: string;
}

/**
 * 获取最新的资产信息
 * @param param 获取最新的余额
 * @param opt 附加查询信息， 如数据库及表
 */
async function getLatestBalance(param: GetStlBalanceRequest, opt?: SettleOption) {
  const { dbName, tableName } = opt || { dbName: 'ads_eqw', tableName: 'ads_account_balance' };
  const { auCode, where } = param;
  const wheres: string[] = ['1=1'];
  if (auCode) {
    wheres.push(`au_code in ('${auCode.map((item) => `${item}`).join("','")}')`);
  }
  if (where) {
    wheres.push(where);
  }
  const whereSql = wheres.join(' and ');

  const subSql = `select au_code, max(trade_date) from ${dbName}.${tableName} where ${whereSql} group by au_code`;
  const sql = `select * from ${dbName}.${tableName} where (au_code, trade_date) in  (${subSql}) `;
  return GetSql({
    sql: sql,
    dbName,
    tableName: tableName,
  }).then((cmd) => {
    if (!cmd) {
      throw new Error('网络错误，请联系管理员');
    }

    if (cmd.code !== 0) {
      throw new Error('获取账户资产信息失败, err: ' + cmd.msg);
    }

    return transform2Objects<StlBalanceItem>(cmd.data.datas);
  });
}

/**
 *
 * @param param 获取结算户资产信息
 * @param opt 附加查询信息， 如数据库及表
 * @returns
 */
async function getBalance(param: GetStlBalanceRequest, opt?: SettleOption) {
  if (param.tradeDate === 'latest') {
    return getLatestBalance(param, opt);
  }
  const { dbName, tableName } = opt || { dbName: 'ads_eqw', tableName: 'ads_account_balance' };
  const { auCode, tradeDate, where } = param;
  const wheres: string[] = [`trade_date = ${tradeDate * 1000}`];
  if (auCode) {
    wheres.push(`au_code in ('${auCode.map((item) => `${item}`).join("','")}')`);
  }

  if (where) {
    wheres.push(where);
  }
  const whereSql = wheres.join(' and ');
  const sql = `select * from ${dbName}.${tableName} where ${whereSql} `;
  return GetSql({
    sql: sql,
    dbName,
    tableName: tableName,
  }).then((cmd) => {
    if (!cmd) {
      throw new Error('网络错误，请联系管理员');
    }

    if (cmd.code !== 0) {
      throw new Error('获取账户资产失败, err: ' + cmd.msg);
    }

    return transform2Objects<StlBalanceItem>(cmd.data.datas);
  });
}

export async function GetStlBalance(
  params: GetStlBalanceRequest & {
    category: 'account' | 'product' | 'unit' | 'checking';
  },
) {
  const optionMap: Record<string, SettleOption> = {
    account: { dbName: 'ads_eqw', tableName: 'ads_account_balances' },
    product: { dbName: 'ads_eqw', tableName: 'ads_account_balances' },
    unit: { dbName: 'ads_eqw', tableName: 'ads_unit_balance' },
    checking: { dbName: 'ads_eqw', tableName: 'ads_account_balances_checking' },
  };

  return getBalance(params, optionMap[params.category]);
}

/**
 * 列表查询资金账户资产
 * @param data 列表请求参数
 * @returns 资金账户资产列表
 */
export const ListAccountBalances = (data: ListStlBalancesRequest) =>
  ListStlBalances({ ...data, category: 'account' });
/**
 * 列表查询资产单元资产信息
 * @param data 列表请求参数
 * @returns 资产单元资产信息列表
 */
export const ListUnitBalances = (data: ListStlBalancesRequest) =>
  ListStlBalances({ ...data, category: 'unit' });
/**
 * @ignore 列表查询产品账户资产
 * @param data 列表请求参数
 * @returns 产品账户资产列表
 */
export const ListProductBalances = (data: ListStlBalancesRequest) =>
  ListStlBalances({ ...data, category: 'product' });
/**
 * @ignore 列表查询结算单(托管券商)资产信息
 * @param data 列表请求参数
 * @returns 结算单(托管券商)资产信息列表
 */
export const ListCheckingBalances = (data: ListStlBalancesRequest) =>
  ListStlBalances({ ...data, category: 'checking' });

/**
 * @ignore 列表查询资金账户(内部清算)持仓信息列表
 * @param data 列表请求参数
 * @returns 资金账户持仓信息列表列表
 */
export const ListAccountPositions = (data: ListStlPositionsRequest) =>
  ListStlPositions({ ...data, category: 'account' });
/**
 * @ignore 列表查询资产单元持仓信息列表
 * @param data 列表请求参数
 * @returns 资产单元持仓信息列表列表
 */
export const ListUnitPositions = (data: ListStlPositionsRequest) =>
  ListStlPositions({ ...data, category: 'unit' });
/**
 * @ignore 列表查询产品持仓信息列表(无该表，使用资金账户进行汇总计算)
 * @param data 列表请求参数
 * @returns 产品持仓信息列表列表
 */
export const ListProductPositions = (data: ListStlPositionsRequest) =>
  ListStlPositions({ ...data, category: 'product' });
/**
 * @ignore 列表查询结算单(托管券商)持仓信息列表
 * @param data 列表请求参数
 * @returns 结算单(托管券商)持仓信息列表列表
 */
export const ListCheckingPositions = (data: ListStlPositionsRequest) =>
  ListStlPositions({ ...data, category: 'checking' });
