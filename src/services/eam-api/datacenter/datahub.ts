import request from '@/services/request';
import type { CMDReply } from '@/services/utils';
import { message } from 'antd';
import moment from 'moment';

const tableMap: Record<string, string> = {
  ns_wind66_rank: 'dm_userdata',
  ads_eqw_benchmark: 'ads_eqw',
  bar_day: 'dm_histdata',
  bar_day_adj: 'dm_histdata',
  ns_wind66_finance_alpha: 'dm_userdata',
  ns_wind66_table_alpha: 'dm_userdata',
  ns_wind66_indloc: 'dm_userdata',
  ns_wind66_stock_alpha: 'dm_userdata',
  sim_account: 'dm_userdata',
  sim_marketvalue_diff: 'dm_userdata',
  sim_position_diff: 'dm_userdata',
  paper_account: 'dm_userdata',
};

export async function GetSql(data: GetSqlRequest): Promise<CMDReply<GetSqlReply>> {
  return request(`/api/datahub/dataset/v1/datahub/sql`, {
    method: 'POST',
    data,
  });
}

export async function GetJsonData(data: GetJsonDataRequest): Promise<CMDReply<GetJsonDataReply>> {
  if (!data.dbName) {
    data.dbName = tableMap[data.table];
  }
  return request(`/api/datahub/dataset/v1/datahub`, {
    method: 'POST',
    data,
  });
}

export async function GetDataHub(data: GetDataHubRequest): Promise<CMDReply<GetDataHubReply>> {
  return request(`/api/datahub/dataset/v1/datahub/getData/matrix`, {
    method: 'POST',
    data,
  });
}

export async function PushDataHub(data: PushDataHubRequest): Promise<CMDReply<PushDataHubReply>> {
  return request(`/api/datahub/dataset/v1/datahub/Pushdata`, {
    method: 'POST',
    data,
  });
}

export async function GetDataHubSqls(
  data: GetDataHubSqlsRequest,
): Promise<CMDReply<GetDataHubSqlsReply>> {
  return request(`/api/datahub/dataset/v1/datahub/sqls`, {
    method: 'POST',
    data,
  });
}

export interface BarDayReply {
  __date_time__: string[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  __symbol__: any[];
}

export type Bar = {
  Datetime: string;
  Symbol: string;
  PreClose: number;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  LowerLimit: number;
  UpperLimit: number;
  TotalAmt: number;
  TotalVol: number;
};

export function parseSymbol(secCode: string) {
  //TODO 这段代码对市场做了临时判断，需要在后续进行优化，变成统一规范码表
  let suffix = '';
  let code = secCode;
  const index = secCode.indexOf('.');
  if (index > 0) {
    code = secCode.substring(0, index);
    const market = secCode.substring(index + 1);
    if (market === 'O' || market === 'N') {
      suffix = 'US';
      return code + '.' + suffix;
    }
    return secCode;
  }
  return code;
}

export function transformBars(replyDatas: Record<string, any[]>): Record<string, Bar[]> {
  const result: Record<string, Bar[]> = {};
  if (!replyDatas || Object.keys(replyDatas).length === 0) return result;

  const datas = {
    datetime: replyDatas.__date_time__,
    open: replyDatas.open,
    high: replyDatas.high,
    low: replyDatas.low,
    close: replyDatas.close,
    preClose: replyDatas.pre_close,
    lowerLimit: replyDatas.lower_limit,
    upperLimit: replyDatas.upper_limit,
    totalAmt: replyDatas.total_amt,
    totalVol: replyDatas.total_vol,
    symbol: replyDatas.__symbol__,
  };

  for (let i = 0; i < datas.datetime.length; i++) {
    const symbol = datas.symbol[i];
    if (!result[symbol]) result[symbol] = [];

    const bar: Bar = {
      Datetime: datas.datetime[i],
      Symbol: symbol,
      PreClose: datas.preClose[i] ?? NaN,
      Open: datas.open[i] ?? NaN,
      High: datas.high[i] ?? NaN,
      Low: datas.low[i] ?? NaN,
      Close: datas.close[i] ?? NaN,
      LowerLimit: datas.lowerLimit[i] ?? NaN,
      UpperLimit: datas.upperLimit[i] ?? NaN,
      TotalAmt: datas.totalAmt[i] ?? NaN,
      TotalVol: datas.totalVol[i] ?? NaN,
    };

    result[symbol].push(bar);
  }

  return result;
}

export function parseBars(reply: GetJsonDataReply): Record<string, Bar[]> {
  const result: Record<string, Bar[]> = transformBars(reply.datas);

  return result;
}

export async function GetBarDay(
  symbols: string[],
  from?: string,
  to?: string,
  adjust: boolean = false,
) {
  const result: Record<string, Bar[]> = {};
  const end = to
    ? moment(to, 'YYYY-MM-DD').add(1, 'd').format('YYYY-MM-DD')
    : moment().add(1, 'd').format('YYYY-MM-DD');
  const req: GetJsonDataRequest = {
    table: adjust ? 'bar_day_adj' : 'bar_day',
    universe: symbols.filter((item) => item.length !== 0),
    from,
    to: end,
    useFinal: 0,
  };

  const cmd = await GetJsonData(req);
  if (!cmd) {
    message.error('网络错误，请联系管理员');
    return result;
  }

  if (cmd.code !== 0) {
    message.error('获取日K数据失败' + cmd.msg);
    return result;
  }

  return parseBars(cmd.data);
}

export async function GetBenchmarks() {
  const result: Record<string, string> = {};
  const req: GetJsonDataRequest = {
    table: 'ads_eqw_benchmark',
  };

  const cmd = await GetJsonData(req);
  if (!cmd) {
    message.error('网络错误，请联系管理员');
    return result;
  }

  if (cmd.code !== 0) {
    message.error('获取基准数据失败' + cmd.msg);
    return result;
  }

  const benchmarkSymbols = cmd.data.datas.Symbol;
  for (let i = 0; i < benchmarkSymbols.length; i++) {
    result[cmd.data.datas.Symbol[i]] = cmd.data.datas.SecNameCN[i];
  }

  return result;
}

export interface valueArray {
  values: any[];
}

export interface GetJsonDataRequest {
  universe?: string[];
  from?: string;
  to?: string;
  fields?: string[];
  dbName?: string;
  table: string;
  filter?: string;
  useFinal?: number; //是否使用final 0使用
}

export interface GetJsonDataReply {
  datas: Record<string, any[]>;
}

export interface GetDataHubRequest {
  universe?: string[];
  from?: string;
  to?: string;
  fields?: string[];
  dbName?: string;
  table: string;
  filter?: string;
}

export interface GetDataHubReply {
  fields: string[];
  values: valueArray[];
}

export interface PushDataHubRequest {
  dbName?: string;
  tableName: string;
  // datas: google.protobuf.Struct;
  datas: Record<string, any[]>;
}

export interface PushDataHubReply {
  status: string;
}

export interface GetSqlRequest {
  dbName: string;
  tableName: string;
  sql: string;
  pageSize?: number;
  pageNum?: number;
}

export interface GetSqlReply {
  datas: Record<string, any[]>;
  count: number;
  pageSize?: number;
  pageNum?: number;
}

export interface GetDataHubSqlsRequest {
  sql: string;
  pageSize?: number;
  pageNum?: number;
}

export interface GetDataHubSqlsReply {
  datas: Record<string, any[]>;
  count: number;
  pageSize?: number;
  pageNum?: number;
}
