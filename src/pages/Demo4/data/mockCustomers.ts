import type { Customer } from "../stores";
import type { CustomerType, CustomerLevel } from "./provinces";
import { PROVINCES, PROVINCE_WEIGHTS, TYPE_DISTRIBUTION } from "./provinces";

const COMPANY_PREFIXES = [
  "华", "中", "国", "华", "中", "金", "银", "星", "宇", "航",
  "天", "地", "人", "和", "盛", "富", "祥", "瑞", "安", "泰",
  "智", "创", "云", "数", "联", "腾", "东方", "南方",
];

const COMPANY_SUFFIXES = [
  "信息技术有限公司",
  "科技有限公司",
  "实业有限公司",
  "集团有限公司",
  "股份有限公司",
  "电子科技有限公司",
  "网络科技有限公司",
  "数据服务有限公司",
  "智能制造有限公司",
  "新能源科技有限公司",
];

const CITIES: Record<string, { name: string; code: string; center: [number, number] }[]> = {
  "51": [
    { name: "成都市", code: "5101", center: [104.0668, 30.5728] },
    { name: "绵阳市", code: "5107", center: [104.6796, 31.4675] },
    { name: "德阳市", code: "5106", center: [104.3987, 31.1279] },
    { name: "南充市", code: "5113", center: [106.1167, 30.8373] },
    { name: "宜宾市", code: "5115", center: [104.6411, 28.7518] },
  ],
  "44": [
    { name: "广州市", code: "4401", center: [113.2644, 23.1291] },
    { name: "深圳市", code: "4403", center: [114.0579, 22.5431] },
    { name: "东莞市", code: "4419", center: [113.7634, 23.0431] },
    { name: "佛山市", code: "4406", center: [113.1227, 23.0218] },
  ],
  "11": [{ name: "北京市", code: "1101", center: [116.4074, 39.9042] }],
  "31": [{ name: "上海市", code: "3101", center: [121.4737, 31.2304] }],
  "32": [
    { name: "南京市", code: "3201", center: [118.7969, 32.0603] },
    { name: "苏州市", code: "3205", center: [120.6279, 31.2994] },
    { name: "无锡市", code: "3202", center: [120.3119, 31.4912] },
  ],
  "33": [
    { name: "杭州市", code: "3301", center: [120.1551, 30.2741] },
    { name: "宁波市", code: "3302", center: [121.5440, 29.8683] },
    { name: "温州市", code: "3303", center: [120.6997, 28.0006] },
  ],
  "37": [
    { name: "济南市", code: "3701", center: [117.0199, 36.6682] },
    { name: "青岛市", code: "3702", center: [120.3826, 36.0671] },
    { name: "烟台市", code: "3706", center: [121.3914, 37.5393] },
  ],
  "42": [
    { name: "武汉市", code: "4201", center: [114.3419, 30.5467] },
    { name: "宜昌市", code: "4205", center: [111.2865, 30.6916] },
    { name: "襄阳市", code: "4206", center: [112.1254, 32.0092] },
  ],
  "41": [
    { name: "郑州市", code: "4101", center: [113.7535, 34.7656] },
    { name: "洛阳市", code: "4103", center: [112.4539, 34.6197] },
  ],
  "61": [
    { name: "西安市", code: "6101", center: [108.9542, 34.3416] },
    { name: "宝鸡市", code: "6103", center: [107.2374, 34.3609] },
  ],
};

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomCoordAround(center: [number, number], radius: number = 0.3): [number, number] {
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.random() * radius;
  return [center[0] + r * Math.cos(angle), center[1] + r * Math.sin(angle)];
}

function randomCustomerType(): CustomerType {
  const rand = Math.random();
  if (rand < TYPE_DISTRIBUTION.potential) return "potential";
  if (rand < TYPE_DISTRIBUTION.potential + TYPE_DISTRIBUTION.partner) return "partner";
  return "key";
}

function randomCustomerLevel(): CustomerLevel {
  return randomPick(["A", "B", "C"]);
}

function generateCompanyName(): string {
  return `${randomPick(COMPANY_PREFIXES)}${randomPick(COMPANY_SUFFIXES)}`;
}

function generateContactName(): string {
  const surnames = ["张", "王", "李", "赵", "刘", "陈", "杨", "黄", "周", "吴"];
  const givenNames = ["伟", "芳", "娜", "敏", "静", "丽", "强", "磊", "军", "洋"];
  return `${randomPick(surnames)}${randomPick(givenNames)}`;
}

function generatePhone(): string {
  const prefixes = ["138", "139", "150", "151", "152", "186", "187", "188"];
  return `${randomPick(prefixes)}${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`;
}

function generateEmail(name: string): string {
  return `${name.toLowerCase()}@${randomPick(["qq.com", "163.com", "126.com", "gmail.com"])}`;
}

function generateLastContact(): string {
  const daysAgo = Math.floor(Math.random() * 90);
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().split("T")[0];
}

function distributeCustomers(): { provinceCode: string; count: number }[] {
  const distribution: { provinceCode: string; count: number }[] = [];
  const totalTarget = 200;
  const sortedProvinces = [...PROVINCES].sort((a, b) => {
    const weightA = PROVINCE_WEIGHTS[a.code] ?? 1;
    const weightB = PROVINCE_WEIGHTS[b.code] ?? 1;
    return weightB - weightA;
  });
  let remaining = totalTarget;
  for (const province of sortedProvinces) {
    if (remaining <= 0) break;
    const weight = PROVINCE_WEIGHTS[province.code] ?? 1;
    const count = Math.min(Math.floor(totalTarget * weight / 100), remaining);
    if (count > 0) {
      distribution.push({ provinceCode: province.code, count });
      remaining -= count;
    }
  }
  return distribution;
}

export function generateMockCustomers(): Customer[] {
  const customers: Customer[] = [];
  const distribution = distributeCustomers();
  let id = 1;
  for (const { provinceCode, count } of distribution) {
    const province = PROVINCES.find((p) => p.code === provinceCode);
    if (!province) continue;
    const cities = CITIES[provinceCode] || [{ name: province.name, code: provinceCode, center: province.center }];
    for (let i = 0; i < count; i++) {
      const city = randomPick(cities);
      const customerType = randomCustomerType();
      const customerLevel = randomCustomerLevel();
      const contactName = generateContactName();
      const coords = randomCoordAround(city.center, 0.3);
      customers.push({
        id: `CUST-${String(id).padStart(6, "0")}`,
        name: generateCompanyName(),
        type: customerType,
        level: customerLevel,
        location: {
          province: provinceCode,
          provinceName: province.name,
          city: city.code,
          cityName: city.name,
          district: city.code + "00",
          districtName: city.name,
          address: `${city.name}某区某路${Math.floor(Math.random() * 500) + 1}号`,
          coordinates: coords,
        },
        stats: {
          revenue: Math.floor(Math.random() * 10000) + 100,
          employees: Math.floor(Math.random() * 5000) + 50,
          lastContact: generateLastContact(),
          dealCount: customerType === "key" ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 5),
        },
        contact: { name: contactName, phone: generatePhone(), email: generateEmail(contactName) },
        tags: [customerType === "key" ? "重点客户" : customerType === "partner" ? "合作伙伴" : "潜在客户"],
        createdAt: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
      id++;
    }
  }
  return customers;
}

export const MOCK_CUSTOMERS = generateMockCustomers();