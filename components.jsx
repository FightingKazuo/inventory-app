import { useState } from "react";
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

// ─── アイテム追加 ────────────────────────────────────────────────────
export function AddItemModal({ catId, onAdd, onClose }) {
  const [d, setD] = useState({ name: "", stock: 1, threshold: 1, unit: "個" });
  return <>
    <div className="modal-title">アイテムを追加</div>
    <div className="flabel">アイテム名</div>
    <input className="finput" placeholder="例: シャンプー" value={d.name}
      onChange={e => setD({ ...d, name: e.target.value })} autoFocus />
    <div className="frow">
      <div>
        <div className="flabel">在庫数</div>
        <input className="finput" type="number" min="0" value={d.stock}
          onChange={e => setD({ ...d, stock: e.target.value })} />
      </div>
      <div>
        <div className="flabel">購入目安</div>
        <input className="finput" type="number" min="0" value={d.threshold}
          onChange={e => setD({ ...d, threshold: e.target.value })} />
      </div>
      <div>
        <div className="flabel">単位</div>
        <input className="finput" placeholder="個" value={d.unit}
          onChange={e => setD({ ...d, unit: e.target.value })} />
      </div>
    </div>
    <button className="btn-primary" onClick={() => d.name.trim() && onAdd(catId, d)}>
      追加する
    </button>
    <button className="btn-cancel" onClick={onClose}>キャンセル</button>
  </>;
}

// ─── アイテム編集 ────────────────────────────────────────────────────
export function EditItemModal({ catId, item, onSave, onClose }) {
  const [d, setD] = useState({ ...item });
  return <>
    <div className="modal-title">アイテムを編集</div>
    <div className="flabel">アイテム名</div>
    <input className="finput" value={d.name}
      onChange={e => setD({ ...d, name: e.target.value })} />
    <div className="frow">
      <div>
        <div className="flabel">在庫数</div>
        <input className="finput" type="number" min="0" value={d.stock}
          onChange={e => setD({ ...d, stock: e.target.value })} />
      </div>
      <div>
        <div className="flabel">購入目安</div>
        <input className="finput" type="number" min="0" value={d.threshold}
          onChange={e => setD({ ...d, threshold: e.target.value })} />
      </div>
      <div>
        <div className="flabel">単位</div>
        <input className="finput" value={d.unit}
          onChange={e => setD({ ...d, unit: e.target.value })} />
      </div>
    </div>
    <button className="btn-primary" onClick={() => d.name.trim() && onSave(catId, d)}>
      保存する
    </button>
    <button className="btn-cancel" onClick={onClose}>キャンセル</button>
  </>;
}

// ─── 購入履歴モーダル（履歴タップで再登録対応）────────────────────────
export function HistoryModal({ catId, item, setModal, onClose, onReuseHistory }) {
  const hist = item.history || [];
  const fav  = item.favorite;

  return <>
    <div className="modal-title">{item.name}</div>
    <div className="modal-sub">
      在庫: {item.stock}{item.unit} · 購入目安: {item.threshold}{item.unit}以下
    </div>

    {/* お気に入り表示 */}
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
        <div key={h.id} className="history-item"
          onClick={() => onReuseHistory(catId, item, h)}>
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
            <div className="hist-date">{h.date}</div>
          </div>
        </div>
      ))}

    <button className="btn-cancel" style={{ marginTop: 16 }} onClick={onClose}>閉じる</button>
  </>;
}

// ─── 購入記録モーダル（商品検索 + メモ + お気に入り）────────────────
export function AddPurchaseModal({ catId, item, onAdd, setModal, prefill }) {
  const [query,   setQuery]   = useState(prefill?.name || item.name);
  const [result,  setResult]  = useState(prefill || null);
  const [loading, setLoading] = useState(false);
  const [memo,    setMemo]    = useState(prefill?.memo || "");
  const [isFav,   setIsFav]   = useState(prefill?.isFavorite || false);

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
          system: `あなたは日本の市販品の情報検索AIです。商品をウェブ検索して、以下のJSON形式のみを返してください。マークダウン・コードブロック・説明文は一切不要です。\n{"name":"商品のフルネーム","brand":"ブランド・メーカー名","description":"日本語での商品説明（40文字以内）","imageUrl":"商品の公式またはECサイト画像の直接URL、見つからなければnull"}`,
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
    onAdd(catId, item.id, { ...base, memo, isFavorite: isFav });
  };

  return <>
    <div className="modal-title">購入商品を記録</div>
    <div className="modal-sub">{item.name} の購入履歴に追加します</div>

    <div className="search-row">
      <input className="search-input" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="商品名・ブランド名" onKeyDown={e => e.key === "Enter" && search()} />
      <button className="search-btn" onClick={search} disabled={loading}>
        {loading ? "…" : "🔍 検索"}
      </button>
    </div>

    {loading && <div className="searching">🔍 商品情報を取得中...</div>}

    {result && !loading && (
      <div className="product-card">
        <ProductImage url={result.imageUrl} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="prod-name">{result.name}</div>
          {result.brand       && <div className="prod-brand">{result.brand}</div>}
          {result.description && <div className="prod-desc">{result.description}</div>}
        </div>
      </div>
    )}

    {result && !loading && (
      <>
        <div className="flabel" style={{ marginTop: 4 }}>メモ（任意）</div>
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
      <button className="btn-ghost"
        onClick={() => handleRecord({ name: query, brand: "", description: "", imageUrl: null })}>
        検索せず「{query}」として記録
      </button>
    )}

    <button className="btn-cancel" onClick={() => setModal({ type: "history", catId, item })}>
      戻る
    </button>
  </>;
}

// ─── 買い物リスト ────────────────────────────────────────────────────
export function ShoppingModal({ shopItems, onClose, toast_ }) {
  const copy = () => {
    const text = shopItems.map(i => {
      const fav  = i.favorite;
      const last = i.history?.[0];
      const rec  = fav
        ? ` ⭐推奨: ${fav.brand || fav.name}`
        : last ? ` 前回: ${last.brand || last.name}` : "";
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
                <div className="shop-info">
                  {item.cat?.icon} {item.cat?.label} · 残り {item.stock}{item.unit}
                </div>
                {fav && (
                  <div className="shop-fav">
                    ⭐ 推奨: {fav.brand ? `${fav.name}（${fav.brand}）` : fav.name}
                  </div>
                )}
                {!fav && last && (
                  <div className="shop-last">前回: {last.brand || last.name}</div>
                )}
              </div>
            </div>
          );
        })}
    {shopItems.length > 0 && (
      <button className="btn-primary" style={{ marginTop: 16 }} onClick={copy}>
        📋 リストをコピー
      </button>
    )}
    <button className="btn-cancel" onClick={onClose}>閉じる</button>
  </>;
}

// ─── モーダルレイヤー ────────────────────────────────────────────────
export function ModalLayer({
  modal, setModal, cats,
  addCat, updateCat, deleteCat,
  addItem, updateItem,
  addPurchase, reuseHistory,
  shopItems, toast_,
}) {
  return (
    <div className="overlay" onClick={() => setModal(null)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        {modal.type === "addCat"      && <AddCatModal onAdd={addCat} onClose={() => setModal(null)} />}
        {modal.type === "editCat"     && <EditCatModal cat={modal.cat} onSave={updateCat} onDelete={deleteCat} onClose={() => setModal(null)} />}
        {modal.type === "addItem"     && <AddItemModal catId={modal.catId} onAdd={addItem} onClose={() => setModal(null)} />}
        {modal.type === "editItem"    && <EditItemModal catId={modal.catId} item={modal.item} onSave={updateItem} onClose={() => setModal(null)} />}
        {modal.type === "history"     && (
          <HistoryModal catId={modal.catId} item={modal.item}
            setModal={setModal} onClose={() => setModal(null)}
            onReuseHistory={reuseHistory} />
        )}
        {modal.type === "addPurchase" && (
          <AddPurchaseModal catId={modal.catId} item={modal.item}
            onAdd={addPurchase} setModal={setModal}
            prefill={modal.prefill} />
        )}
        {modal.type === "shopping"    && <ShoppingModal shopItems={shopItems} onClose={() => setModal(null)} toast_={toast_} />}
      </div>
    </div>
  );
}
