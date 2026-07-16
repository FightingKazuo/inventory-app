import { useState, useEffect, useRef } from "react";
import { PRESET_ICONS, PRESET_COLORS } from "./constants.js";

// ─── 商品画像 ────────────────────────────────────────────────────────
export function ProductImage({ url, size = 52 }) {
  const [err, setErr] = useState(false);
  const box = {
    width: size, height: size, borderRadius: 10, flexShrink: 0,
    overflow: "hidden", background: "#F7F4EF",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.45,
  };
  if (!url || err) return <div style={box}>🛍️</div>;
  return (
    <div style={box}>
      <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setErr(true)} />
    </div>
  );
}

// ─── カテゴリー追加 ──────────────────────────────────────────────────
export function AddCatModal({ onAdd, onClose }) {
  const [label, setLabel] = useState("");
  const [icon,  setIcon]  = useState("🧴");
  const [color, setColor] = useState("#5BAD8F");
  return <>
    <div className="modal-title">カテゴリーを追加</div>
    <div className="modal-sub">新しいカテゴリーを作成します</div>
    <div className="flabel">カテゴリー名</div>
    <input className="finput" placeholder="例: お風呂" value={label}
      onChange={e => setLabel(e.target.value)} autoFocus />
    <div className="flabel">アイコン</div>
    <div className="icon-picker">
      {PRESET_ICONS.map(ic => (
        <button key={ic} className={`icon-opt ${icon === ic ? "sel" : ""}`}
          onClick={() => setIcon(ic)}>{ic}</button>
      ))}
    </div>
    <div className="flabel">カラー</div>
    <div className="color-picker">
      {PRESET_COLORS.map(c => (
        <div key={c} className={`color-opt ${color === c ? "sel" : ""}`}
          style={{ background: c }} onClick={() => setColor(c)} />
      ))}
    </div>
    <button className="btn-primary" onClick={() => label.trim() && onAdd({ label, icon, color })}>
      追加する
    </button>
    <button className="btn-cancel" onClick={onClose}>キャンセル</button>
  </>;
}

// ─── カテゴリー編集 ──────────────────────────────────────────────────
export function EditCatModal({ cat, onSave, onDelete, onClose }) {
  const [data,    setData]    = useState({ ...cat });
  const [confirm, setConfirm] = useState(false);
  return <>
    <div className="modal-title">カテゴリー設定</div>
    <div className="flabel">名前</div>
    <input className="finput" value={data.label}
      onChange={e => setData({ ...data, label: e.target.value })} />
    <div className="flabel">アイコン</div>
    <div className="icon-picker">
      {PRESET_ICONS.map(ic => (
        <button key={ic} className={`icon-opt ${data.icon === ic ? "sel" : ""}`}
          onClick={() => setData({ ...data, icon: ic })}>{ic}</button>
      ))}
    </div>
    <div className="flabel">カラー</div>
    <div className="color-picker">
      {PRESET_COLORS.map(c => (
        <div key={c} className={`color-opt ${data.color === c ? "sel" : ""}`}
          style={{ background: c }} onClick={() => setData({ ...data, color: c })} />
      ))}
    </div>
    <button className="btn-primary" onClick={() => data.label.trim() && onSave(data)}>
      保存する
    </button>
    {!confirm
      ? <button className="btn-danger" onClick={() => setConfirm(true)}>このカテゴリーを削除</button>
      : <button className="btn-danger" style={{ fontWeight: 800 }} onClick={() => onDelete(cat.id)}>
          ⚠️ 削除を確定する
        </button>}
    <button className="btn-cancel" onClick={onClose}>キャンセル</button>
  </>;
}

// ─── カスタムキーパッド ──────────────────────────────────────────────
function NumPad({ value, onChange, onClose }) {
  const tap = (v) => {
    if (v === "del") {
      onChange(String(value).slice(0, -1) || "0");
    } else if (v === "ok") {
      onClose();
    } else {
      const next = String(value) === "0" ? String(v) : String(value) + String(v);
      onChange(next.slice(0, 3)); // 最大3桁
    }
  };
  const keys = [["1","2","3"],["4","5","6"],["7","8","9"],["","0","del"]];
  return (
    <div className="numpad-wrap">
      {keys.map((row, ri) => (
        <div key={ri} className="numpad-row">
          {row.map((k, ki) => (
            <button key={ki} className={`numpad-key ${k === "" ? "numpad-empty" : ""} ${k === "del" ? "numpad-del" : ""} ${k === "ok" ? "numpad-ok" : ""}`}
              onClick={() => k !== "" && tap(k)}>
              {k === "del" ? "⌫" : k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── アイテム追加 ────────────────────────────────────────────────────
export function AddItemModal({ catId, onAdd, onClose, prefill }) {
  const [d,       setD]       = useState({
    name: prefill?.name || "",
    stock: "1", threshold: "1",
    unit: prefill?.unit || "個",
  });
  const [focus, setFocus] = useState(null); // "stock" | "threshold" | "unit" | "name"

  const UNIT_PRESETS = ["個","本","袋","枚","缶","箱","パック","ロール","セット"];

  const updateNum = (field, val) => {
    const n = val === "" ? "0" : val;
    setD(prev => ({ ...prev, [field]: n }));
  };

  return <>
    <div className="modal-title">アイテムを追加</div>

    {prefill && (
      <div className="scan-result-card">
        <div className="scan-result-name">{prefill.name}</div>
        {prefill.brand && <div className="scan-result-sub">{prefill.brand}</div>}
      </div>
    )}

    {/* アイテム名（通常キーボード） */}
    <div className="flabel">アイテム名</div>
    <input className="finput" placeholder="例: シャンプー" value={d.name}
      onChange={e => setD({ ...d, name: e.target.value })}
      onFocus={() => setFocus("name")} autoFocus />

    {/* 数値フィールド（カスタムキーパッド） */}
    <div className="frow" style={{ marginBottom: 8 }}>
      <div>
        <div className="flabel">在庫数</div>
        <div className={`numfield ${focus === "stock" ? "active" : ""}`}
          onClick={() => setFocus("stock")}>
          {d.stock}
        </div>
      </div>
      <div>
        <div className="flabel">購入目安</div>
        <div className={`numfield ${focus === "threshold" ? "active" : ""}`}
          onClick={() => setFocus("threshold")}>
          {d.threshold}
        </div>
      </div>
      <div>
        <div className="flabel">単位</div>
        <div className={`numfield ${focus === "unit" ? "active" : ""}`}
          onClick={() => setFocus("unit")} style={{ fontSize: 14 }}>
          {d.unit}
        </div>
      </div>
    </div>

    {/* 単位プリセット */}
    {focus === "unit" && (
      <div className="unit-presets">
        {UNIT_PRESETS.map(u => (
          <button key={u} className={`unit-preset-btn ${d.unit === u ? "active" : ""}`}
            onClick={() => { setD(prev => ({ ...prev, unit: u })); setFocus(null); }}>
            {u}
          </button>
        ))}
      </div>
    )}

    {/* カスタムキーパッド */}
    {(focus === "stock" || focus === "threshold") && (
      <NumPad value={d[focus]} onChange={v => updateNum(focus, v)} onClose={() => setFocus(null)} />
    )}

    <button className="btn-primary" style={{ marginTop: 8 }}
      onClick={() => d.name.trim() && onAdd(catId, d)}>
      追加する
    </button>
    <button className="btn-cancel" onClick={onClose}>キャンセル</button>
  </>;
}

// ─── アイテム編集 ────────────────────────────────────────────────────
export function EditItemModal({ catId, item, onSave, onClose }) {
  const [d,            setD]            = useState({
    ...item,
    stock:     String(item.stock),
    threshold: String(item.threshold),
  });
  const [focus,        setFocus]        = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const logCount = (item.usageLogs || []).length;

  const UNIT_PRESETS = ["個","本","袋","枚","缶","箱","パック","ロール","セット"];
  const updateNum = (field, val) => setD(prev => ({ ...prev, [field]: val === "" ? "0" : val }));

  return <>
    <div className="modal-title">アイテムを編集</div>
    <div className="flabel">アイテム名</div>
    <input className="finput" value={d.name}
      onChange={e => setD({ ...d, name: e.target.value })}
      onFocus={() => setFocus("name")} />

    <div className="frow" style={{ marginBottom: 8 }}>
      <div>
        <div className="flabel">在庫数</div>
        <div className={`numfield ${focus === "stock" ? "active" : ""}`}
          onClick={() => setFocus("stock")}>{d.stock}</div>
      </div>
      <div>
        <div className="flabel">購入目安</div>
        <div className={`numfield ${focus === "threshold" ? "active" : ""}`}
          onClick={() => setFocus("threshold")}>{d.threshold}</div>
      </div>
      <div>
        <div className="flabel">単位</div>
        <div className={`numfield ${focus === "unit" ? "active" : ""}`}
          onClick={() => setFocus("unit")} style={{ fontSize: 14 }}>{d.unit}</div>
      </div>
    </div>

    {focus === "unit" && (
      <div className="unit-presets">
        {UNIT_PRESETS.map(u => (
          <button key={u} className={`unit-preset-btn ${d.unit === u ? "active" : ""}`}
            onClick={() => { setD(prev => ({ ...prev, unit: u })); setFocus(null); }}>
            {u}
          </button>
        ))}
      </div>
    )}

    {(focus === "stock" || focus === "threshold") && (
      <NumPad value={d[focus]} onChange={v => updateNum(focus, v)} onClose={() => setFocus(null)} />
    )}

    <button className="btn-primary" style={{ marginTop: 8 }}
      onClick={() => d.name.trim() && onSave(catId, d)}>
      保存する
    </button>

    {logCount > 0 && (
      !confirmReset
        ? <button className="btn-danger" onClick={() => setConfirmReset(true)}>
            消費履歴をリセット（{logCount}件）
          </button>
        : <button className="btn-danger" style={{ fontWeight: 800 }}
            onClick={() => onSave(catId, { ...d, usageLogs: [] })}>
            ⚠️ リセットを確定する
          </button>
    )}

    <button className="btn-cancel" onClick={onClose}>キャンセル</button>
  </>;
}

// ─── バーコードスキャンモーダル（カメラ撮影 → Claude Vision）────────
export function ScanModal({ catId, onItemFound, onClose, onScanResult, onScanClose }) {
  const [status,  setStatus]  = useState("idle"); // idle | loading | found | error
  const [result,  setResult]  = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    setStatus("loading");
    setResult(null);

    try {
      // base64に変換
      const base64 = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = (ev) => resolve(ev.target.result.split(",")[1]);
        r.readAsDataURL(file);
      });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `この画像のバーコード（JAN/EAN）を読み取り、日本の商品として検索してください。以下のJSON形式のみを返してください。説明文・コードブロック不要。
{"name":"商品のフルネーム","brand":"ブランド・メーカー名","description":"日本語での商品説明（40文字以内）","imageUrl":"商品画像のURL or null"}`,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: file.type || "image/jpeg", data: base64 } },
              { type: "text", text: "この画像のバーコードを読み取って商品を特定してください。" }
            ]
          }]
        }),
      });

      const data = await res.json();
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      const s = text.indexOf("{"), e = text.lastIndexOf("}");
      if (s !== -1 && e !== -1) {
        try {
          const parsed = JSON.parse(text.slice(s, e + 1));
          setResult(parsed);
          setStatus("found");
          return;
        } catch {}
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    if (onScanClose) onScanClose();
    else if (onClose) onClose();
  };

  return <>
    <div className="modal-title">📷 バーコードをスキャン</div>
    <div className="modal-sub">商品のバーコードを撮影してください</div>

    {/* 撮影ボタン */}
    {status === "idle" && (
      <>
        <div style={{ background: "#F7F4EF", borderRadius: 14, padding: "32px 20px", textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <div style={{ fontSize: 14, color: "#A89E94", lineHeight: 1.7 }}>
            バーコードが見える状態で<br />カメラで撮影してください
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          style={{ display: "none" }}
        />
        <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
          📷 カメラで撮影する
        </button>
      </>
    )}

    {/* 読み取り中 */}
    {status === "loading" && (
      <>
        {preview && (
          <img src={preview} alt="撮影画像" style={{ width: "100%", borderRadius: 12, marginBottom: 12, objectFit: "cover", maxHeight: 200 }} />
        )}
        <div className="searching">🔍 バーコードを読み取り中...</div>
      </>
    )}

    {/* 結果 */}
    {status === "found" && result && (
      <>
        {preview && (
          <img src={preview} alt="撮影画像" style={{ width: "100%", borderRadius: 12, marginBottom: 12, objectFit: "cover", maxHeight: 160 }} />
        )}
        <div className="scan-result-card">
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <ProductImage url={result.imageUrl} size={60} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="scan-result-name">{result.name}</div>
              {result.brand && <div className="scan-result-sub">{result.brand}</div>}
              {result.description && <div className="scan-result-sub" style={{ marginTop: 4 }}>{result.description}</div>}
            </div>
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: 8 }}
          onClick={() => {
            if (onScanResult) onScanResult(result);
            else if (onItemFound) onItemFound(catId, result);
          }}>
          {onScanResult ? "この商品で記録する" : "このアイテムを追加する"}
        </button>
        <button className="btn-ghost" style={{ marginTop: 8 }}
          onClick={() => { setStatus("idle"); setResult(null); setPreview(null); }}>
          撮り直す
        </button>
      </>
    )}

    {/* エラー */}
    {status === "error" && (
      <>
        {preview && (
          <img src={preview} alt="撮影画像" style={{ width: "100%", borderRadius: 12, marginBottom: 12, objectFit: "cover", maxHeight: 160 }} />
        )}
        <div className="stats-empty">
          バーコードを読み取れませんでした<br />
          <span style={{ fontSize: 11 }}>バーコードが画面全体に大きく映るように撮り直してください</span>
        </div>
        <button className="btn-primary" style={{ marginTop: 8 }}
          onClick={() => { setStatus("idle"); setResult(null); setPreview(null); }}>
          撮り直す
        </button>
      </>
    )}

    <button className="btn-cancel" style={{ marginTop: 12 }} onClick={handleClose}>
      閉じる
    </button>
  </>;
}


// ─── 消費統計モーダル ────────────────────────────────────────────────
export function StatsModal({ cats, items, onClose }) {
  // 過去6ヶ月のラベル生成
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(`${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  // 全アイテムの usageLogs を月別集計
  const allItems = cats.flatMap(cat =>
    (items[cat.id] || []).map(item => ({ ...item, cat }))
  );

  // usageLogsがあるアイテムだけ表示
  const statsItems = allItems
    .map(item => {
      const monthly = {};
      months.forEach(m => { monthly[m] = 0; });
      (item.usageLogs || []).forEach(log => {
        const d = new Date(log.date);
        const key = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthly[key] !== undefined) monthly[key]++;
      });
      const total = Object.values(monthly).reduce((a, b) => a + b, 0);
      return { ...item, monthly, total };
    })
    .filter(i => i.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxVal = Math.max(1, ...statsItems.flatMap(i => Object.values(i.monthly)));

  return <>
    <div className="modal-title">📊 消費統計</div>
    <div className="modal-sub">過去6ヶ月の使用回数</div>

    {statsItems.length === 0
      ? <div className="stats-empty">
          まだデータがありません<br />
          <span style={{ fontSize: 11 }}>−ボタンで在庫を減らすと記録されます</span>
        </div>
      : statsItems.map(item => (
        <div key={`${item.cat.id}-${item.id}`} className="stats-card">
          <div className="stats-item-name">
            {item.cat.icon} {item.name}
            <span style={{ fontSize: 11, color: "#A89E94", fontWeight: 400, marginLeft: 8 }}>
              計{item.total}回
            </span>
          </div>
          {months.map(m => {
            const val   = item.monthly[m];
            const pct   = Math.round(val / maxVal * 100);
            const label = m.slice(5);
            // 0件月はグレーで薄く表示
            return (
              <div key={m} className="bar-row" style={{ opacity: val === 0 ? 0.35 : 1 }}>
                <div className="bar-label">{label}月</div>
                <div className="bar-track">
                  <div className="bar-fill"
                    style={{
                      width: val === 0 ? "4px" : `${Math.max(pct, 8)}%`,
                      background: val === 0 ? "#C4BEB8" : item.cat.color,
                    }}>
                    {val > 0 && <span className="bar-val">{val}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

    <button className="btn-cancel" style={{ marginTop: 8 }} onClick={onClose}>閉じる</button>
  </>;
}

// ─── 購入履歴モーダル ────────────────────────────────────────────────
export function HistoryModal({ catId, item, setModal, onClose, onReuseHistory, onDeleteHistory }) {
  const hist = item.history || [];
  const fav  = item.favorite;

  return <>
    <div className="modal-title">{item.name}</div>
    <div className="modal-sub">
      在庫: {item.stock}{item.unit} · 購入目安: {item.threshold}{item.unit}以下
    </div>

    {fav && (
      <div style={{ background: "#FFFDF0", border: "1.5px solid #F9E84A", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <ProductImage url={fav.imageUrl} size={40} />
        <div>
          <div style={{ fontSize: 11, color: "#B8960A", fontWeight: 700, marginBottom: 2 }}>⭐ お気に入り商品</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{fav.name}</div>
          {fav.brand && <div style={{ fontSize: 12, color: "#A89E94" }}>{fav.brand}</div>}
        </div>
      </div>
    )}

    <button className="btn-record" onClick={() => setModal({ type: "addPurchase", catId, item })}>
      ＋ 購入した商品を記録
    </button>

    {hist.length > 0 && (
      <div className="hist-reuse-hint">↓ 過去の商品をタップして再登録</div>
    )}

    {hist.length === 0
      ? <div className="no-history">
          まだ記録がありません<br />
          <span style={{ fontSize: 11 }}>購入した商品を上のボタンで記録できます</span>
        </div>
      : hist.map((h, idx) => (
        <div key={h.id} className="history-item-wrap">
          <div className="history-item" style={{ flex: 1 }} onClick={() => onReuseHistory(catId, item, h)}>
            <ProductImage url={h.imageUrl} size={52} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                <div className="hist-name">{h.name}</div>
                {idx === 0 && <span className="latest-tag">最新</span>}
                {h.isFavorite && <span className="fav-tag">⭐ お気に入り</span>}
              </div>
              {h.brand       && <div className="hist-brand">{h.brand}</div>}
              {h.description && <div className="hist-desc">{h.description}</div>}
              {h.memo        && <div className="hist-memo">📝 {h.memo}</div>}
              <div className="hist-date">{h.date}{h.qty > 1 ? ` · ${h.qty}${item.unit}購入` : ""}</div>
            </div>
          </div>
          <button className="hist-del-btn" onClick={() => onDeleteHistory(catId, item.id, h.id, h.qty || 1)}>🗑️</button>
        </div>
      ))}

    <button className="btn-cancel" style={{ marginTop: 16 }} onClick={onClose}>閉じる</button>
  </>;
}

// ─── 購入記録モーダル ────────────────────────────────────────────────
export function AddPurchaseModal({ catId, item, onAdd, setModal, prefill }) {
  const today = new Date().toISOString().slice(0, 10);
  const [query,   setQuery]   = useState(prefill?.name || item.name);
  const [result,  setResult]  = useState(prefill || null);
  const [loading, setLoading] = useState(false);
  const [memo,    setMemo]    = useState(prefill?.memo || "");
  const [isFav,   setIsFav]   = useState(prefill?.isFavorite || false);
  const [buyDate, setBuyDate] = useState(today);
  const [qty,     setQty]     = useState(1);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `あなたは日本の市販品の情報検索AIです。商品をウェブ検索して、以下のJSON形式のみを返してください。マークダウン・コードブロック・説明文は一切不要です。
{"name":"商品のフルネーム","brand":"ブランド・メーカー名","description":"日本語での商品説明（40文字以内）","imageUrl":"商品の公式またはECサイト画像の直接URL、見つからなければnull"}`,
          messages: [{ role: "user", content: `日本の商品を検索してください: ${query}` }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      const s = text.indexOf("{"), e = text.lastIndexOf("}");
      if (s !== -1 && e !== -1) {
        try { setResult(JSON.parse(text.slice(s, e + 1))); }
        catch { setResult({ name: query, brand: "", description: "", imageUrl: null }); }
      } else {
        setResult({ name: query, brand: "", description: "", imageUrl: null });
      }
    } catch {
      setResult({ name: query, brand: "", description: "", imageUrl: null });
    }
    setLoading(false);
  };

  const handleRecord = (base) => {
    onAdd(catId, item.id, { ...base, memo, isFavorite: isFav, buyDate, qty });
  };

  // 📷ボタン → スキャンモーダルに切り替え（結果を持って戻る）
  const openScanner = () => {
    setModal({
      type: "scan",
      catId,
      // スキャン完了後に呼ばれるコールバック
      onScanResult: (scanResult) => {
        setModal({ type: "addPurchase", catId, item, prefill: {
          name: scanResult.name || query,
          brand: scanResult.brand || "",
          description: scanResult.description || "",
          imageUrl: scanResult.imageUrl || null,
          memo: "", isFavorite: false,
        }});
      },
      onScanClose: () => setModal({ type: "addPurchase", catId, item, prefill: null }),
    });
  };

  return <>
    <div className="modal-title">購入商品を記録</div>
    <div className="modal-sub">{item.name} の購入履歴に追加します</div>

    {/* 検索行 */}
    <div className="search-row">
      <input className="search-input" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="商品名・ブランド名" onKeyDown={e => e.key === "Enter" && search()} />
      <button className="search-btn" onClick={search} disabled={loading}>
        {loading ? "…" : "🔍"}
      </button>
      <button className="scan-inline-btn" onClick={openScanner} title="バーコードスキャン">
        📷
      </button>
    </div>

    {loading && <div className="searching">🔍 商品情報を取得中...</div>}

    {/* 商品結果 */}
    {result && !loading && (
      <div className="product-card">
        <ProductImage url={result.imageUrl} size={56} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="prod-name">{result.name}</div>
          {result.brand       && <div className="prod-brand">{result.brand}</div>}
          {result.description && <div className="prod-desc">{result.description}</div>}
        </div>
      </div>
    )}

    {/* 購入日 */}
    <div style={{ marginTop: 12 }}>
      <div className="flabel">購入日</div>
      <input
        type="date" value={buyDate}
        onChange={e => setBuyDate(e.target.value)}
        style={{ display: "block", width: "100%", boxSizing: "border-box", border: "2px solid #EEE9E2", borderRadius: 10, padding: "11px 13px", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#F7F4EF", marginBottom: 10 }}
      />
    </div>
    {/* 本数 */}
    <div style={{ marginBottom: 4 }}>
      <div className="flabel">本数</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number" min="1" max="99" value={qty}
          onChange={e => setQty(Math.max(1, +e.target.value))}
          style={{ width: 80, boxSizing: "border-box", border: "2px solid #EEE9E2", borderRadius: 10, padding: "11px 8px", fontSize: 18, fontFamily: "inherit", outline: "none", background: "#F7F4EF", textAlign: "center" }}
        />
        <span style={{ fontSize: 14, color: "#A89E94" }}>{item.unit}</span>
      </div>
    </div>

    {result && !loading && (
      <>
        <div className="flabel" style={{ marginTop: 12 }}>メモ（任意）</div>
        <textarea className="ftextarea" placeholder="例: 香り少し強め・詰め替え用"
          value={memo} onChange={e => setMemo(e.target.value)} />
        <button className={`btn-fav ${isFav ? "active" : ""}`} onClick={() => setIsFav(v => !v)}>
          {isFav ? "⭐ お気に入りに設定済み" : "☆ お気に入りに設定する"}
        </button>
        <button className="btn-primary" style={{ marginTop: 12 }}
          onClick={() => handleRecord(result)}>
          この商品を記録する
        </button>
      </>
    )}

    {!result && !loading && (
      <button className="btn-ghost" style={{ marginTop: 8 }}
        onClick={() => handleRecord({ name: query, brand: "", description: "", imageUrl: null })}>
        検索せず「{query}」として記録
      </button>
    )}

    <button className="btn-cancel" onClick={() => setModal({ type: "history", catId, item })}>
      戻る
    </button>
  </>;
}


// ─── 設定モーダル ────────────────────────────────────────────────────
export function SettingsModal({ cats, items, setModal, onClose, resetAllData, onImport }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [importError,  setImportError]  = useState("");
  const [importOk,     setImportOk]     = useState(false);
  const fileRef = useRef(null);

  // エクスポート
  const handleExport = () => {
    const data = { version: 1, exportedAt: new Date().toISOString(), cats, items };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `inventory-backup-${new Date().toLocaleDateString("ja-JP").replace(/\//g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // インポート
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(""); setImportOk(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.cats || !data.items) throw new Error("形式が違います");
        onImport(data.cats, data.items);
        setImportOk(true);
      } catch (err) {
        setImportError("読み込めませんでした。正しいバックアップファイルを選んでください。");
      }
    };
    reader.readAsText(file);
  };

  const menuItems = [
    { icon: "📂", label: "カテゴリー管理", sub: `${cats.length}件`, action: () => setModal({ type: "catManager" }) },
    { icon: "📊", label: "消費統計",       sub: "過去6ヶ月",        action: () => setModal({ type: "stats" }) },
  ];

  return <>
    <div className="modal-title">⚙️ 設定</div>

    <div className="settings-menu">
      {menuItems.map((m, i) => (
        <button key={i} className="settings-menu-row" onClick={m.action}>
          <span className="settings-menu-icon">{m.icon}</span>
          <span className="settings-menu-label">{m.label}</span>
          <span className="settings-menu-sub">{m.sub}</span>
          <span className="settings-menu-arrow">›</span>
        </button>
      ))}
    </div>

    <div className="settings-divider" style={{ margin: "16px 0" }} />

    {/* バックアップ */}
    <div className="settings-label">💾 バックアップ</div>
    <div className="settings-menu" style={{ marginBottom: 8 }}>
      <button className="settings-menu-row" onClick={handleExport}>
        <span className="settings-menu-icon">📤</span>
        <span className="settings-menu-label">データをエクスポート</span>
        <span className="settings-menu-sub">JSONで保存</span>
        <span className="settings-menu-arrow">›</span>
      </button>
      <button className="settings-menu-row" onClick={() => fileRef.current?.click()}>
        <span className="settings-menu-icon">📥</span>
        <span className="settings-menu-label">データをインポート</span>
        <span className="settings-menu-sub">JSONから復元</span>
        <span className="settings-menu-arrow">›</span>
      </button>
    </div>
    <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
    {importOk    && <div style={{ fontSize: 13, color: "#5BAD8F", marginBottom: 8 }}>✅ インポートしました</div>}
    {importError && <div style={{ fontSize: 13, color: "#E8734A", marginBottom: 8 }}>⚠️ {importError}</div>}

    <div className="settings-divider" style={{ margin: "16px 0" }} />

    {/* データリセット */}
    <div className="settings-label">🗂️ データ管理</div>
    {!confirmReset
      ? <button className="btn-danger" onClick={() => setConfirmReset(true)}>
          すべてのデータをリセット
        </button>
      : <button className="btn-danger" style={{ fontWeight: 800 }} onClick={resetAllData}>
          ⚠️ リセットを確定する（元に戻せません）
        </button>}

    <button className="btn-cancel" style={{ marginTop: 12 }} onClick={onClose}>閉じる</button>
  </>;
}

// ─── カテゴリー管理モーダル ──────────────────────────────────────────
export function CatManagerModal({ cats, setModal, onClose }) {
  return <>
    <div className="modal-title">📂 カテゴリー管理</div>
    <div className="settings-menu">
      {cats.map(cat => (
        <button key={cat.id} className="settings-menu-row"
          onClick={() => setModal({ type: "editCat", cat: { ...cat } })}>
          <span className="settings-menu-icon">{cat.icon}</span>
          <span className="settings-menu-label">{cat.label}</span>
          <span className="settings-menu-sub" />
          <span className="settings-menu-arrow">›</span>
        </button>
      ))}
    </div>
    <button className="btn-primary" style={{ marginTop: 12 }}
      onClick={() => setModal({ type: "addCat" })}>
      ＋ カテゴリーを追加
    </button>
    <button className="btn-cancel" onClick={onClose}>閉じる</button>
  </>;
}

// ─── 買い物リスト ────────────────────────────────────────────────────
export function ShoppingModal({ shopItems, onClose, toast_ }) {
  const copy = () => {
    const text = shopItems.map(i => {
      const fav  = i.favorite;
      const last = i.history?.[0];
      const rec  = fav ? ` ⭐推奨: ${fav.brand || fav.name}` : last ? ` 前回: ${last.brand || last.name}` : "";
      return `・${i.name}（残り${i.stock}${i.unit}）${rec}`;
    }).join("\n");
    navigator.clipboard?.writeText(text).then(() => { toast_("コピーしました"); onClose(); });
  };

  return <>
    <div className="modal-title">🛒 買い物リスト</div>
    {shopItems.length === 0
      ? <div className="no-history" style={{ padding: "32px 0" }}>✅ 今すぐ買うものはありません</div>
      : shopItems.map(item => {
          const fav  = item.favorite;
          const last = item.history?.[0];
          return (
            <div key={`${item.cat?.id}-${item.id}`} className="shop-item">
              <div className="shop-dot" style={{ background: item.cat?.color || "#888" }} />
              <div>
                <div className="shop-name">{item.name}</div>
                <div className="shop-info">{item.cat?.icon} {item.cat?.label} · 残り {item.stock}{item.unit}</div>
                {fav  && <div className="shop-fav">⭐ 推奨: {fav.brand ? `${fav.name}（${fav.brand}）` : fav.name}</div>}
                {!fav && last && <div className="shop-last">前回: {last.brand || last.name}</div>}
              </div>
            </div>
          );
        })}
    {shopItems.length > 0 && (
      <button className="btn-primary" style={{ marginTop: 16 }} onClick={copy}>📋 リストをコピー</button>
    )}
    <button className="btn-cancel" onClick={onClose}>閉じる</button>
  </>;
}

// ─── モーダルレイヤー ────────────────────────────────────────────────
export function ModalLayer({
  modal, setModal, cats, items,
  addCat, updateCat, deleteCat,
  addItem, updateItem,
  addPurchase, reuseHistory, deleteHistory,
  onScanFound,
  toast_,
  resetAllData,
  onImport,
}) {
  return (
    <div className="overlay" onClick={() => setModal(null)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        {modal.type === "addCat"      && <AddCatModal onAdd={addCat} onClose={() => setModal(null)} />}
        {modal.type === "editCat"     && <EditCatModal cat={modal.cat} onSave={updateCat} onDelete={deleteCat} onClose={() => setModal(null)} />}
        {modal.type === "addItem"     && <AddItemModal catId={modal.catId} onAdd={addItem} onClose={() => setModal(null)} prefill={modal.prefill} />}
        {modal.type === "editItem"    && <EditItemModal catId={modal.catId} item={modal.item} onSave={updateItem} onClose={() => setModal(null)} />}
        {modal.type === "history"     && <HistoryModal catId={modal.catId} item={modal.item} setModal={setModal} onClose={() => setModal(null)} onReuseHistory={reuseHistory} onDeleteHistory={deleteHistory} />}
        {modal.type === "addPurchase" && <AddPurchaseModal catId={modal.catId} item={modal.item} onAdd={addPurchase} setModal={setModal} prefill={modal.prefill} />}
        {modal.type === "shopping"    && <ShoppingModal shopItems={shopItems} onClose={() => setModal(null)} toast_={toast_} />}
        {modal.type === "scan"        && <ScanModal catId={modal.catId} onItemFound={onScanFound} onClose={() => setModal(null)} onScanResult={modal.onScanResult} onScanClose={modal.onScanClose} />}
        {modal.type === "stats"       && <StatsModal cats={cats} items={items} onClose={() => setModal(null)} />}
        {modal.type === "settings"    && <SettingsModal cats={cats} items={items} setModal={setModal} onClose={() => setModal(null)} resetAllData={resetAllData} onImport={onImport} />}
        {modal.type === "catManager"  && <CatManagerModal cats={cats} setModal={setModal} onClose={() => setModal(null)} />}
      </div>
    </div>
  );
}
