// シンプルなSVGアイコン（Notionスタイル）
// key: id, value: SVGパス or 絵文字
export const ICON_SET = [
  { id: "home",      label: "家",       svg: "🏠" },
  { id: "kitchen",   label: "キッチン",  svg: "🍳" },
  { id: "bath",      label: "お風呂",    svg: "🛁" },
  { id: "laundry",   label: "洗濯",      svg: "🧺" },
  { id: "beauty",    label: "美容",      svg: "💄" },
  { id: "health",    label: "健康",      svg: "💊" },
  { id: "food",      label: "食品",      svg: "🥫" },
  { id: "clean",     label: "掃除",      svg: "🧹" },
  { id: "baby",      label: "ベビー",    svg: "🍼" },
  { id: "pet",       label: "ペット",    svg: "🐾" },
  { id: "plant",     label: "植物",      svg: "🌿" },
  { id: "tools",     label: "工具",      svg: "🔧" },
  { id: "box",       label: "備品",      svg: "📦" },
  { id: "office",    label: "オフィス",  svg: "🖥️" },
  { id: "sport",     label: "スポーツ",  svg: "🏋️" },
  { id: "drink",     label: "飲み物",    svg: "🍶" },
  { id: "cold",      label: "冷蔵",      svg: "🧊" },
  { id: "skin",      label: "スキンケア", svg: "🧴" },
  { id: "tooth",     label: "歯",        svg: "🪥" },
  { id: "glove",     label: "手袋",      svg: "🧤" },
  { id: "plant2",    label: "観葉植物",  svg: "🪴" },
  { id: "toilet",    label: "トイレ",    svg: "🚽" },
  { id: "recycle",   label: "ゴミ",      svg: "♻️" },
  { id: "car",       label: "車",        svg: "🚗" },
];

// 後方互換（PRESET_ICONSを使っている箇所用）
export const PRESET_ICONS = ICON_SET.map(i => i.svg);

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

// ストレージキー（固定）
export const STORAGE_CATS  = "inv-cats";
export const STORAGE_ITEMS = "inv-items";

// 旧キー一覧（移行用）
export const LEGACY_KEYS = [
  { cats: "inv5-cats",  items: "inv5-items"  },
  { cats: "inv4-cats",  items: "inv4-items"  },
  { cats: "inv3-cats",  items: "inv3-items"  },
];

// グローバルID（カテゴリープレフィックスで一意にする）
// kitchen:1000台, laundry:2000台, cosmetics:3000台, cat_xxx:動的
let _gId = 9000; // デフォルトは9000台からスタート

export const initGId = (maxExistingId) => {
  if (maxExistingId >= _gId) _gId = maxExistingId + 1;
};

export const nextId = () => ++_gId;

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
