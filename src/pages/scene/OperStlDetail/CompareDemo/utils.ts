export type FormatOption = {
  decUnit?: number;
  decLen?: number;
  nanStr?: string;
  eps?: number;
};

export function formatNumber(value: any, opt?: FormatOption) {
  const { nanStr = '--', eps } = opt || {};
  if (isNaN(+value)) return nanStr;

  let val = value;
  if (eps && Math.abs(+value) < eps) val = 0;

  const { decUnit = 1, decLen } = opt || {};
  if (decLen === undefined) {
    return Number(+val / decUnit).toLocaleString();
  }

  return Number(+val / decUnit).toLocaleString('zh', {
    minimumFractionDigits: decLen,
    maximumFractionDigits: decLen,
  });
}
