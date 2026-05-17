// 中国34个省级行政区数据
export const PROVINCES = [
  { code: "11", name: "北京市", center: [116.4074, 39.9042] as [number, number], centroid: [116.4074, 39.9042] },
  { code: "12", name: "天津市", center: [117.2016, 39.1332] as [number, number], centroid: [117.2016, 39.1332] },
  { code: "13", name: "河北省", center: [114.5149, 38.0428] as [number, number], centroid: [114.5149, 38.0428] },
  { code: "14", name: "山西省", center: [112.549, 37.857] as [number, number], centroid: [112.549, 37.857] },
  { code: "15", name: "内蒙古自治区", center: [111.7656, 40.8174] as [number, number], centroid: [111.7656, 40.8174] },
  { code: "21", name: "辽宁省", center: [123.4328, 41.8087] as [number, number], centroid: [123.4328, 41.8087] },
  { code: "22", name: "吉林省", center: [125.3245, 43.8868] as [number, number], centroid: [125.3245, 43.8868] },
  { code: "23", name: "黑龙江省", center: [126.5343, 45.8032] as [number, number], centroid: [126.5343, 45.8032] },
  { code: "31", name: "上海市", center: [121.4737, 31.2304] as [number, number], centroid: [121.4737, 31.2304] },
  { code: "32", name: "江苏省", center: [118.7969, 32.0603] as [number, number], centroid: [118.7969, 32.0603] },
  { code: "33", name: "浙江省", center: [120.1551, 30.2741] as [number, number], centroid: [120.1551, 30.2741] },
  { code: "34", name: "安徽省", center: [117.2846, 31.8612] as [number, number], centroid: [117.2846, 31.8612] },
  { code: "35", name: "福建省", center: [119.2965, 26.0745] as [number, number], centroid: [119.2965, 26.0745] },
  { code: "36", name: "江西省", center: [115.8581, 28.6829] as [number, number], centroid: [115.8581, 28.6829] },
  { code: "37", name: "山东省", center: [117.0199, 36.6682] as [number, number], centroid: [117.0199, 36.6682] },
  { code: "41", name: "河南省", center: [113.7535, 34.7656] as [number, number], centroid: [113.7535, 34.7656] },
  { code: "42", name: "湖北省", center: [114.3419, 30.5467] as [number, number], centroid: [114.3419, 30.5467] },
  { code: "43", name: "湖南省", center: [112.9442, 28.2369] as [number, number], centroid: [112.9442, 28.2369] },
  { code: "44", name: "广东省", center: [113.2644, 23.1291] as [number, number], centroid: [113.2644, 23.1291] },
  { code: "45", name: "广西壮族自治区", center: [108.3274, 22.8174] as [number, number], centroid: [108.3274, 22.8174] },
  { code: "46", name: "海南省", center: [110.3492, 20.0174] as [number, number], centroid: [110.3492, 20.0174] },
  { code: "50", name: "重庆市", center: [106.5516, 29.563] as [number, number], centroid: [106.5516, 29.563] },
  { code: "51", name: "四川省", center: [104.0668, 30.5728] as [number, number], centroid: [104.0668, 30.5728] },
  { code: "52", name: "贵州省", center: [106.7074, 26.5982] as [number, number], centroid: [106.7074, 26.5982] },
  { code: "53", name: "云南省", center: [102.7107, 25.0453] as [number, number], centroid: [102.7107, 25.0453] },
  { code: "54", name: "西藏自治区", center: [91.1172, 29.6476] as [number, number], centroid: [91.1172, 29.6476] },
  { code: "61", name: "陕西省", center: [108.9542, 34.3416] as [number, number], centroid: [108.9542, 34.3416] },
  { code: "62", name: "甘肃省", center: [103.8264, 36.0014] as [number, number], centroid: [103.8264, 36.0014] },
  { code: "63", name: "青海省", center: [101.7782, 36.6239] as [number, number], centroid: [101.7782, 36.6239] },
  { code: "64", name: "宁夏回族自治区", center: [106.2599, 38.4682] as [number, number], centroid: [106.2599, 38.4682] },
  { code: "65", name: "新疆维吾尔自治区", center: [87.6278, 43.7938] as [number, number], centroid: [87.6278, 43.7938] },
  { code: "71", name: "台湾省", center: [121.509, 25.0443] as [number, number], centroid: [121.509, 25.0443] },
  { code: "81", name: "香港特别行政区", center: [114.1774, 22.3027] as [number, number], centroid: [114.1774, 22.3027] },
  { code: "82", name: "澳门特别行政区", center: [113.5497, 22.1929] as [number, number], centroid: [113.5497, 22.1929] },
] as const;

export type ProvinceCode = typeof PROVINCES[number]["code"];

export function getProvinceByCode(code: string) {
  return PROVINCES.find((p) => p.code === code);
}

export const PROVINCE_WEIGHTS: Record<string, number> = {
  "11": 30,
  "31": 25,
  "44": 20,
  "32": 18,
  "33": 15,
  "37": 15,
  "51": 12,
  "42": 10,
  "41": 10,
  "61": 8,
  "其他": 37,
};

export type CustomerType = "potential" | "partner" | "key";

export const TYPE_DISTRIBUTION = {
  potential: 0.4,
  partner: 0.35,
  key: 0.25,
} as const;

export type CustomerLevel = "A" | "B" | "C";

export const CUSTOMER_COLORS = {
  potential: "#789eff",
  partner: "#3061DB",
  key: "#bdcfff",
} as const;