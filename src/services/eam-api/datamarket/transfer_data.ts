/**
 * 数据格式转换
 * @description: 提供将datahub数据进行转换的方法
 *
 * transform2Objects: 将数据格式由 Record<strign, any[]> 转换为 T[]
 */

// 接收一个string数组，将字符串由蛇形转为 Record<string, 小驼峰string>
export function snake2Camel(str: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  str.forEach((item) => {
    result[item] = item.replace(/_(\w)/g, (all, letter) => letter.toUpperCase());
  });
  return result;
}

/**
 * 数据转换函数配置项
 */
export interface TransformOption {
  /**
   * 需要转换为数字的字段, 字段名为转换后的字段名
   * 使用场景：int64返回给前端的是string. 需要转换为number(todo: 后期考虑是否需要变更为BigInt)
   */
  numbers?: string[];
}

/**
 * 数据转换函数
 * @param data datahub返回的数据
 * @returns 结构体数组
 * @description 将datahub返回的数据转换为结构体数组
 */
export function transform2Objects<T>(data: Record<string, any[]>, opt?: TransformOption): T[] {
  const result: T[] = [];
  const keys = Object.keys(data);
  if (keys.length === 0) return result;
  const keyMap = snake2Camel(keys);
  const numMap: Record<string, boolean> = {};
  if (opt?.numbers) {
    opt.numbers.forEach((item) => {
      numMap[item] = true;
    });
  }

  const len = data[keys[0]].length;
  for (let i = 0; i < len; i++) {
    const item: Record<string, any> = {};
    keys.forEach((key) => {
      const objKey = keyMap[key];
      item[objKey] = numMap[objKey] ? +data[key][i] : data[key][i];
    });

    result.push(item as T);
  }

  return result;
}
