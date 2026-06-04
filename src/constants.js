export const PRESET_ICONS = [
  "🍳","🧺","💄","🧹","🛁","💊","🐾","🖥️","🌿","🏋️","🧴","🪥","🍶","🧤","🪴","🧊","🔧","📦"
];

export const PRESET_COLORS = [
  "#E8734A","#4A90D9","#C06A9E","#5BAD8F","#8B7EC8",
  "#D4A843","#E85555","#45B8AC","#F09436","#7EB8D4"
];

export const DEFAULT_CATEGORIES = [
  { id: "kitchen",   label: "キッチン", icon: "🍳", color: "#E8734A" },
  { id: "laundry",   label: "洗濯",     icon: "🧺", color: "#4A90D9" },
  { id: "cosmetics", label: "化粧品",   icon: "💄", color: "#C06A9E" },
];

export const DEFAULT_ITEMS = {
  kitchen: [
    { id: 1, name: "食器用洗剤",      stock: 2, threshold: 1, unit: "本",    history: [], usageLogs: [] },
    { id: 2, name: "キッチンペーパー", stock: 3, threshold: 2, unit: "ロール", history: [], usageLogs: [] },
  ],
  laundry: [
    { id: 3, name: "洗濯洗剤", stock: 1, threshold: 1, unit: "本", history: [], usageLogs: [] },
    { id: 4, name: "柔軟剤",   stock: 2, threshold: 1, unit: "本", history: [], usageLogs: [] },
  ],
  cosmetics: [
    { id: 5, name: "シャンプー",       stock: 2, threshold: 1, unit: "本", history: [], usageLogs: [] },
    { id: 6, name: "コンディショナー", stock: 1, threshold: 1, unit: "本", history: [], usageLogs: [] },
  ],
};

// ストレージキー
export const STORAGE_CATS  = "inv5-cats";
export const STORAGE_ITEMS = "inv5-items";

// グローバルID
export let gId = 400;
export const nextId = () => ++gId;

// 消費予測：usageLogsから平均消費日数を計算
// usageLogs = [{ date: "2026/06/01" }, ...]  (−ボタンを押すたびに追記)
export function calcPrediction(item) {
  const logs = item.usageLogs || [];
  if (logs.length < 2) return null; // データ不足

  // 日付を昇順ソート
  const dates = logs
    .map(l => new Date(l.date))
    .sort((a, b) => a - b);

  // 連続する日付間の差分（日）を集計
  const gaps = [];
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff > 0) gaps.push(diff);
  }
  if (gaps.length === 0) return null;

  const avgDays = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const daysLeft = Math.round(avgDays * item.stock);

  return {
    avgDays: Math.round(avgDays * 10) / 10, // 小数1桁
    daysLeft,
  };
}
