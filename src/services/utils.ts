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
