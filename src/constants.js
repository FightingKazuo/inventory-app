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

// ストレージキー（固定 — 今後変えない）
export const STORAGE_CATS  = "inv-cats";
export const STORAGE_ITEMS = "inv-items";

// 旧キー一覧（移行用 — 新しい順に並べる）
export const LEGACY_KEYS = [
  { cats: "inv5-cats",  items: "inv5-items"  },
  { cats: "inv4-cats",  items: "inv4-items"  },
  { cats: "inv3-cats",  items: "inv3-items"  },
];

// グローバルID
export let gId = 400;
export const nextId = () => ++gId;

// 消費予測
export function calcPrediction(item) {
  const logs = item.usageLogs || [];
  if (logs.length < 2) return null;
  const dates = logs.map(l => new Date(l.date)).sort((a, b) => a - b);
  const gaps = [];
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff > 0) gaps.push(diff);
  }
  if (gaps.length === 0) return null;
  const avgDays = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const daysLeft = Math.round(avgDays * item.stock);
  return { avgDays: Math.round(avgDays * 10) / 10, daysLeft };
}
