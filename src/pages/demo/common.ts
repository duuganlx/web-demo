import dayjs from 'dayjs';

/**
 * author: lvxiang
 * description: 存放一些通用的函数
 */
export interface CommonDataItem {
  // 时间戳
  timestamp10: number; // 10位时间戳
  temperature: number; // 温度
  temp10Thousand: number; // 温度(万倍)
  temp100Million: number; // 温度(亿倍)
  prevTemperature: number; // 前一个时间单位的温度
  tempPnl: number; // 温度变化幅度 = (curTemp - prevTemp) / prevTemp
}

// 数据生成函数
export function genCommonDataArray(size: number) {
  const data: CommonDataItem[] = [];

  let index = 0;
  // HH:mm:ss => 23:59:59
  let itime = dayjs().endOf('day').subtract(size, 'day');
  let prevTemperature = 0;

  while (index < size) {
    const temperature = Math.random() * 10;

    const tempPnl = (temperature - prevTemperature) / prevTemperature;

    const tmp: CommonDataItem = {
      timestamp10: itime.unix(),
      temperature: temperature,
      temp10Thousand: temperature * 10000,
      temp100Million: temperature * 100000000,
      prevTemperature: prevTemperature,
      tempPnl: tempPnl,
    };

    itime = itime.add(1, 'day');
    index++;
    prevTemperature = temperature;
    data.push(tmp);
  }

  return data;
}

export function formatVal(v: any, decUnit: number, decLen: number, opt?: { sign: boolean }) {
  const { sign = false } = opt || {};
  if (isNaN(+v)) {
    return '-';
  }

  let val = +v / decUnit;
  // 处理 -0 问题
  if (+val.toFixed(decLen) === 0) {
    val = 0;
  }

  return (
    (sign && val > 0 ? '+' : '') +
    Number(val).toLocaleString('zh', {
      minimumFractionDigits: decLen,
      maximumFractionDigits: decLen,
    })
  );
}
